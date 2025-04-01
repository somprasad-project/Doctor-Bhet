import mongoose, { Mongoose } from "mongoose";

const doctorSchema = new mongoose.Schema({
    name:{type:String, requried: true},
    email:{type:String, requried: true, unique:true},
    password:{type:String, requried: true},
    image:{type:String, requried: true},
    speciality :{type:String, requried: true},
    degree:{type:String, requried: true},
    experience:{type:String, requried: true},
    about: {type:String, required:true},
    available:{type:Boolean, default:true},
    fees: {type:Number, requried: true},
   address: {type:Object, requried: true},
   date: {type: Number,requried: true },
   slots_booked : {type: Object,default: {}},


}, {minimize:false})

const doctorModel = mongoose.models.doctor ||  mongoose.model('doctor', doctorSchema)

export default doctorModel