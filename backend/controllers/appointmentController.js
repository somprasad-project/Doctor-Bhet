// const Appointment = require('../models/appointmentModel');
// const { v4: uuidv4 } = require('uuid');
// const jwt = require('jsonwebtoken');

// const createAppointment = async (req, res) => {
//   try {
//     const { userId, docId, slotDate, slotTime, consultationType, docData, userData, amount } = req.body;

//     // Validate required fields
//     if (!userId || !docId || !slotDate || !slotTime || !consultationType || !docData || !userData || !amount) {
//       return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     // Validate consultationType
//     if (!['Video Consultation', 'In-person Visit'].includes(consultationType)) {
//       return res.status(400).json({ success: false, message: 'Invalid consultation type' });
//     }

//     // Validate slotDate and slotTime formats (example: DD_MM_YYYY, HH:MM AM/PM)
//     const dateRegex = /^\d{2}_\d{2}_\d{4}$/;
//     const timeRegex = /^\d{1,2}:\d{2} (AM|PM)$/;
//     if (!dateRegex.test(slotDate) || !timeRegex.test(slotTime)) {
//       return res.status(400).json({ success: false, message: 'Invalid date or time format' });
//     }

//     // Check for slot conflicts
//     const existingAppointment = await Appointment.findOne({ docId, slotDate, slotTime, cancelled: false });
//     if (existingAppointment) {
//       return res.status(400).json({ success: false, message: 'Doctor is already booked for this slot' });
//     }

//     // Generate roomName for video consultations
//     const roomName = consultationType === 'Video Consultation' ? `appointment-${uuidv4()}` : null;

//     const appointment = new Appointment({
//       userId,
//       docId,
//       slotDate,
//       slotTime,
//       consultationType,
//       roomName,
//       docData,
//       userData,
//       amount,
//       date: Date.now(),
//     });

//     await appointment.save();

//     res.status(201).json({ success: true, message: 'Appointment created successfully', appointment });
//   } catch (error) {
//     console.error('Error creating appointment:', error.message);
//     res.status(500).json({ success: false, message: `Failed to create appointment: ${error.message}` });
//   }
// };

// const completeAppointment = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.isCompleted) {
//       return res.status(400).json({ success: false, message: 'Appointment already completed' });
//     }

//     appointment.isCompleted = true;
//     await appointment.save();

//     res.status(200).json({ success: true, message: 'Appointment marked as completed' });
//   } catch (error) {
//     console.error('Error completing appointment:', error.message);
//     res.status(500).json({ success: false, message: `Failed to mark appointment as completed: ${error.message}` });
//   }
// };

// const getDoctorAppointments = async (req, res) => {
//   try {
//     const { doctorId } = req.query;
//     if (!doctorId) {
//       return res.status(400).json({ success: false, message: 'Doctor ID is required' });
//     }

//     const appointments = await Appointment.find({ docId: doctorId })
//       .sort({ slotDate: 1, slotTime: 1 });
//     res.status(200).json({ success: true, appointments });
//   } catch (error) {
//     console.error('Error fetching doctor appointments:', error.message);
//     res.status(500).json({ success: false, message: `Failed to fetch appointments: ${error.message}` });
//   }
// };

// const getUserAppointments = async (req, res) => {
//   try {
//     const userId = req.user._id; // Set by authentication middleware
//     const appointments = await Appointment.find({ userId })
//       .sort({ date: -1 });
//     res.status(200).json({ success: true, appointments });
//   } catch (error) {
//     console.error('Error fetching user appointments:', error.message);
//     res.status(500).json({ success: false, message: `Failed to fetch appointments: ${error.message}` });
//   }
// };

// const cancelAppointment = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;
//     const userId = req.user._id;

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.userId !== userId) {
//       return res.status(403).json({ success: false, message: 'Unauthorized' });
//     }

//     if (appointment.cancelled) {
//       return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
//     }

//     if (appointment.isCompleted) {
//       return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
//     }

//     appointment.cancelled = true;
//     await appointment.save();

//     res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
//   } catch (error) {
//     console.error('Error cancelling appointment:', error.message);
//     res.status(500).json({ success: false, message: `Failed to cancel appointment: ${error.message}` });
//   }
// };

// const generateJitsiToken = async (req, res) => {
//   try {
//     const { appointmentId, userId, userName } = req.body;

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.userId !== userId) {
//       return res.status(403).json({ success: false, message: 'Unauthorized' });
//     }

//     if (appointment.consultationType !== 'Video Consultation' || !appointment.roomName) {
//       return res.status(400).json({ success: false, message: 'No video consultation room available' });
//     }

//     if (appointment.isCompleted || appointment.cancelled) {
//       return res.status(400).json({ success: false, message: 'Cannot join completed or cancelled appointment' });
//     }

//     const payload = {
//       context: {
//         user: {
//           name: userName,
//           id: userId,
//         },
//       },
//       aud: 'jitsi',
//       iss: process.env.JITSI_APP_ID,
//       sub: appointment.roomName,
//       room: appointment.roomName,
//       exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
//     };

//     const token = jwt.sign(payload, process.env.JITSI_SECRET);
//     res.status(200).json({ success: true, token });
//   } catch (error) {
//     console.error('Error generating Jitsi token:', error.message);
//     res.status(500).json({ success: false, message: `Failed to generate token: ${error.message}` });
//   }
// };

// module.exports = {
//   createAppointment,
//   completeAppointment,
//   getDoctorAppointments,
//   getUserAppointments,
//   cancelAppointment,
//   generateJitsiToken,
// };