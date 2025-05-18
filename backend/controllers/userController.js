import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import { v2 as cloudinary } from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';
import nodemailer from "nodemailer";
import sendEmail from '../utils/sendEmail.js';

import crypto from "crypto";

const createUserToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

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



// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            text: `Click the following link to reset your password:\n${resetLink}`,
        });

        res.status(200).json({ success: true, message: "Password reset email sent!" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userModel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully!" });
    } catch (error) {
        console.log("Error in reset password:", error);
        res.status(500).json({ success: false, message: "Internal Server Error!" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id; // Assumes authentication middleware sets req.user

        // Input validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Check if new password is same as current
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }

        // Hash and update the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
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


// // API to book appointment
// const bookAppointment = async (req, res) => {
//     try {
//         const { userId, docId, slotDate, slotTime } = req.body

//         const docData = await doctorModel.findById(docId).select('-password')

//         if (!docData.available) {

//             return res.json({ success: false, message: 'doctor not available' })

//         }

//         let slots_booked = docData.slots_booked

//         // checking for slot availabilty

//         if (slots_booked[slotDate]) {
//             if (slots_booked[slotDate].includes(slotTime)) {
//                 return res.json({ success: false, message: 'slot not avilable' })
//             } else {
//                 slots_booked[slotDate].push(slotTime)

//             }

//         } else {
//             slots_booked[slotDate] = []
//             slots_booked[slotDate].push(slotTime)
//         }

//         const userData = await userModel.findById(userId).select('-password')

//         delete docData.slots_booked

//         const appointmentData = {
//             userId,
//             docId,
//             userData,
//             docData,
//             amount: docData.fees,
//             slotTime,
//             slotDate,
//             date: Date.now()
//         }

//         //save in the data base

//         const newAppointment = new appointmentModel(appointmentData)
//         await newAppointment.save()


//         //save new slots data in docdata
//         await doctorModel.findByIdAndUpdate(docId, { slots_booked })
//         res.json({ success: true, message: 'Appointment booked' })



//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }


//booking  appointment

// const bookAppointment = async (req, res) => {
//     try {
//         const { userId, docId, slotDate, slotTime, consultationType, payment } = req.body; // ✅ Include consultationType

//         const docData = await doctorModel.findById(docId).select('-password');

//         if (!docData.available) {
//             return res.json({ success: false, message: 'doctor not available' });
//         }

//         let slots_booked = docData.slots_booked;

//         if (slots_booked[slotDate]) {
//             if (slots_booked[slotDate].includes(slotTime)) {
//                 return res.json({ success: false, message: 'slot not available' });
//             } else {
//                 slots_booked[slotDate].push(slotTime);
//             }
//         } else {
//             slots_booked[slotDate] = [];
//             slots_booked[slotDate].push(slotTime);
//         }

//         const userData = await userModel.findById(userId).select('-password');
//         delete docData.slots_booked;

//         const appointmentData = {
//             userId,
//             docId,
//             userData,
//             docData,
//             amount: docData.fees,
//             slotTime,
//             slotDate,
//             date: Date.now(),
//             consultationType,
//             payment, // ✅ Save to database
//         };

//         const newAppointment = new appointmentModel(appointmentData);
//         await newAppointment.save();

//         await doctorModel.findByIdAndUpdate(docId, { slots_booked });

//         res.json({ success: true, message: 'Appointment booked' });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

//booking appointment and sending email to doctor
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, consultationType, payment } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'doctor not available' });
        }

        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            consultationType,
            payment,
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // ✅ Send email to doctor
        const doctorEmail = docData.email;
        const subject = 'New Appointment Booked';
        const message = `Dear Dr. ${docData.name},\n\nA new appointment has been booked.\nDate: ${slotDate}\nTime: ${slotTime}\nConsultation Type: ${consultationType}\n\nPlease check your dashboard for more details.\n\nThank you,\nYour Appointment System`;

        await sendEmail(doctorEmail, subject, message);

        res.json({ success: true, message: 'Appointment booked and doctor notified' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


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




const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    // Verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }

    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    let slots_booked = doctorData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send email to doctor
    const doctorEmail = doctorData.email;
    const subject = 'Appointment Cancellation Notice';
    const message = `Dear Dr. ${doctorData.name},\n\nThe appointment scheduled on ${slotDate} at ${slotTime} has been cancelled by the patient.\n\nThank you,\nYour Appointment System`;

    await sendEmail(doctorEmail, subject, message);

    res.json({ success: true, message: 'Appointment Cancelled and doctor notified' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// // API to cancel the appointment

// const cancelAppointment = async (req, res) => {

//     try {

//         const { userId, appointmentId } = req.body

//         const appointmentData = await appointmentModel.findById(appointmentId)

//         /// verified appointment user

//         if (appointmentData.userId !== userId) {

//             return res.json({ success: false, message: ' Unauthorized action ' })

//         }

//         await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

//         //releasing doctor slot

//         const { docId, slotDate, slotTime } = appointmentData

//         const doctorData = await doctorModel.findById(docId)

//         let slots_booked = doctorData.slots_booked

//         slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

//         await doctorModel.findByIdAndUpdate(docId, { slots_booked })

//         res.json({ success: true, message: 'Appointment Cancelled' })

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }


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


const paymentEsewa = async (req, res) => {
    const { AppointmentId } = req.body
    const appointmentData = await appointmentModel.findById(AppointmentId)

    if (!appointmentData || appointmentData.cancelled) {

        return res.json({ success: false, message: "appointment Cancelled or not found " })

    }


}



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, forgotPassword, resetPassword, changePassword };
