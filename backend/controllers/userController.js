import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import { v2 as cloudinary } from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';
// import axios from 'axios';




// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // validating the email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        // validating a strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // Check if email is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "This email is already registered. Please use another email." });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

/// API to get user profile data

const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message });

    }

}

/// API to update user profile

const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imagefile = req.file

        if (!name || !phone || !address || !dob || !gender) {

            return res.json({ success: false, message: "Data missing" })


        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })


        if (imagefile) {

            // upload image to cloudinary

            const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })


        }

        res.json({ success: true, message: "profile Updated" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }

}


// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {

            return res.json({ success: false, message: 'doctor not available' })

        }

        let slots_booked = docData.slots_booked

        // checking for slot availabilty

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'slot not avilable' })
            } else {
                slots_booked[slotDate].push(slotTime)

            }

        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        //save in the data base

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()


        //save new slots data in docdata
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment booked' })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user Appointment for frontend  my-appointment page

const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel the appointment

const cancelAppointment = async (req, res) => {

    try {

        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        /// verified appointment user

        if (appointmentData.userId !== userId) {

            return res.json({success:false,message:' Unauthorized action '})
            
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        //releasing doctor slot

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime) 

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:'Appointment Cancelled'})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//API to make payment of appointment using esewa

// const axios = require("axios");
// const crypto = require("crypto");

// async function getEsewaPaymentHash({ amount, transaction_uuid }) {
//   try {
//     const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

//     const secretKey = process.env.ESEWA_SECRET_KEY;
//     const hash = crypto
//       .createHmac("sha256", secretKey)
//       .update(data)
//       .digest("base64");

//     return {
//       signature: hash,
//       signed_field_names: "total_amount,transaction_uuid,product_code",
//     };
//   } catch (error) {
//     throw error;
//   }
// }

// async function verifyEsewaPayment(encodedData) {
//   try {
//     // decoding base64 code revieved from esewa
//     let decodedData = atob(encodedData);
//     decodedData = await JSON.parse(decodedData);
//     let headersList = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };

//     const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

//     const secretKey = process.env.ESEWA_SECRET_KEY;
//     const hash = crypto
//       .createHmac("sha256", secretKey)
//       .update(data)
//       .digest("base64");

//     console.log(hash);
//     console.log(decodedData.signature);
//     let reqOptions = {
//       url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
//       method: "GET",
//       headers: headersList,
//     };
//     if (hash !== decodedData.signature) {
//       throw { message: "Invalid Info", decodedData };
//     }
//     let response = await axios.request(reqOptions);
//     if (
//       response.data.status !== "COMPLETE" ||
//       response.data.transaction_uuid !== decodedData.transaction_uuid ||
//       Number(response.data.total_amount) !== Number(decodedData.total_amount)
//     ) {
//       throw { message: "Invalid Info", decodedData };
//     }
//     return { response: response.data, decodedData };
//   } catch (error) {
//     throw error;
//   }
// }


const paymentEsewa = async(req, res) => {
    const {AppointmentId} = req.body
    const appointmentData = await appointmentModel.findById(AppointmentId)

    if (!appointmentData || appointmentData.cancelled) {

        return res.json({success:false, message:"appointment Cancelled or not found "})
        
    }


}



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };
