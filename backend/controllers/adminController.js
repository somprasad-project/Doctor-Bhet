import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
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

        doctorData ={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:json.prase(address), //object converting to string(store a address an object in databse )
            date:date.now()


        }

        const newDoctor = new doctorModel(doctorModel)
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

export {addDoctor, loginAdmin}