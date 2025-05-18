import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

const changeAvailabilty = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availabilty Changed' })


    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {

    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for the docotr Login

const loginDoctor = async (req, res) => {
    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//  // API to get dashboard data for doctor panel

const appointmentsDoctor = async (req, res) => {

    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })


    }

}

//Api to mark appointment completeted for docotr panel


// const appointmentComplete = async (req, res) => {

//     try {

//         const { docId, appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if (appointmentData && appointmentData.docId === docId) {

//             await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
//             return res.json({ success: true, message: 'Appointment Completed' })

//         } else {
//             return res.json({ success: false, message: 'Marked failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }
// }



const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        // ✅ Update appointment status
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

        // ✅ Fetch patient details
        const patient = await userModel.findById(appointmentData.userId);

        if (patient) {
            const subject = 'Appointment Completed';
            const message = `Dear ${patient.name},\n\nYour appointment scheduled on ${appointmentData.slotDate} at ${appointmentData.slotTime} has been successfully marked as completed.\n\nWe hope you had a good consultation.\n\nThank you,\nAppointment Team`;

            await sendEmail(patient.email, subject, message);
        }

        return res.json({ success: true, message: 'Appointment marked as completed and patient notified' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};



// //Api to cancel appointment  for docotr panel


// const appointmentCancel = async (req, res) => {

//     try {

//         const { docId, appointmentId } = req.body
//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if (appointmentData && appointmentData.docId === docId) {

//             await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
//             return res.json({ success: true, message: 'Appointment Cancelled' })

//         } else {
//             return res.json({ success: false, message: 'Cancellation Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }
// }

//appointementCancel and sending mail 

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ✅ Fetch patient details
        const patient = await userModel.findById(appointmentData.userId);

        if (patient) {
            const subject = 'Appointment Cancellation by Doctor';
            const message = `Dear ${patient.name},\n\nYour appointment scheduled on ${appointmentData.slotDate} at ${appointmentData.slotTime} has been cancelled by the doctor.\n\nWe apologize for the inconvenience.\n\nThank you,\nAppointment Team`;

            await sendEmail(patient.email, subject, message);
        }

        return res.json({ success: true, message: 'Appointment Cancelled and patient notified' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};



//API to get dashBoard data for docotr panel

const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        let earings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earings += item.amount

            }
        })

        let patients = []

        appointments.map((item) => {
            if (patients.includes(item.userId)) {
                patients.push(item.userId)

            }
        })

        const dashData = {
            earings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })


    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

//Api to get docotr profile for Doctor panel

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

//api updateDoctorprofile data from Docotr panel

const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message:'Profile Updated' })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailabilty, doctorList,
    loginDoctor,
    appointmentsDoctor, appointmentCancel, appointmentComplete,
    doctorDashboard, doctorProfile,
    updateDoctorProfile
}