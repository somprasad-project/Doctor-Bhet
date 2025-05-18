import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  roomName: { type: String }, //

  // ✅ Correctly added consultationType here
  consultationType: {
    type: String,
    enum: ['Video Consultation', 'In-person Visit'],
    required: true
  },
  reminderSent: { type: Boolean, default: false },
  
});

const appointmentModel = mongoose.models.appointment || mongoose.model("Appointment", appointmentSchema);



export default appointmentModel;


// import mongoose from "mongoose";

// const appointmentSchema = new mongoose.Schema({
//     userId: { type: String, required: true },
//     docId: { type: String, required: true },
//     slotDate: { type: String, required: true },
//     slotTime: { type: String, required: true },
//     userData: { type: Object, required: true },
//     docData: { type: Object, required: true },
//     amount: { type: Number, required: true },
//     date: { type: Number, required: true },
//     cancelled: { type: Boolean, default: false },
//     payment: { type: Boolean, default: false },
//     isCompleted: { type: Boolean, default: false }

    

    
// })

// const appointmentModel = mongoose.models.appointment || mongoose.model('Appointment', appointmentSchema);

// export default appointmentModel;
