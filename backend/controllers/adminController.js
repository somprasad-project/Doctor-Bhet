import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
//API for Adding Doctor

const addDoctor = async (req,res) => {
    try{
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file
        // console.log({ name, email, password, speciality, degree, experience, about, fess, address }, imageFile);

        //checking for all data to add docotr

        if( !name || !email || !password || !speciality || !degree  || !experience || !about || !fees || !address){
            return res.json({success:false, message:"Missing Details"})

        }

        //validating email format

        if(!validator.isEmail(email)){

            return res.json({success:false, message:"please enter the valid email"})
        }

        // validating strong password

        if(password.length < 8){
            return res.json({success:false, message:"please enter a strong password"})

        }

        // salt ot hashing the docotr password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        //uploading image to cloudnary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address), // Convert JSON string to object
            date: Date.now() // Get current timestamp
       

        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})

        

     } catch (error){

        console.log(error)
        res.json({success:false,message:error.message})

     }

}

// api for the admin login

    const loginAdmin = async (req, res) => {
        //if email an pp matching in that case we will create a token using json  web token
        try{
            const {email, password} =req.body

            if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
                
                const token =jwt.sign(email+password,process.env.JWT_SECRET)
                res.json({success:true,token})

            }else{
                res.json({success:false,message:"Invalid credentials"})
            }


        }catch{
            console.log(error)
        res.json({success:false,message:error.message})

        }

    }


    //API to get all doctors list for admin pannel

    const allDoctors = async (req, res)=>{
        try {

            const doctors = await doctorModel.find({}).select('-password')
            res.json({success:true,doctors})
            
        } catch (error) {
            console.log(error)
        res.json({success:false,message:error.message})
            
        }
    }

    // APi to get all appointment list

    const appointmentsAdmin = async (req, res) => {

        try {

            const appointments = await appointmentModel.find({})
            res.json({success:true, appointments})
            
        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message})
        }

    }


    //Api for the appointment Cancellation

    const appointmentCancel = async (req, res) => {

        try {
    
            const {appointmentId} = req.body
    
            const appointmentData = await appointmentModel.findById(appointmentId)

    
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

    //Api to get dashboard data for Admin panel

    const adminDashboard = async (req, res) => {
        try {

            const doctors = await doctorModel.find({})
            const users = await userModel.find({})
            const appointments = await appointmentModel.find({})

            const dashData = {
                doctors: doctors.length,
                appointments: appointmentCancel.length,
                patients: userModel.length,
                latestAppointments: appointments.reverse().slice(0,5)
            }

            res.json({success:true,dashData})
            
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }


export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }