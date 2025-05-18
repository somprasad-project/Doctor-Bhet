const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

// Create appointment with video call details
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    if (!req.body.doctor || !req.body.patient || !req.body.slotDate || !req.body.slotTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate doctor and patient IDs
    if (!mongoose.Types.ObjectId.isValid(req.body.doctor) || 
        !mongoose.Types.ObjectId.isValid(req.body.patient)) {
      return res.status(400).json({ error: 'Invalid doctor or patient ID' });
    }

    // Generate unique room name using appointment ID (we'll update after save)
    const tempRoomName = `temp-room-${Date.now()}`;
    const tempPassword = generatePassword();

    const appointment = new Appointment({
      doctor: req.body.doctor,
      patient: req.body.patient,
      slotDate: req.body.slotDate,
      slotTime: req.body.slotTime,
      consultationType: req.body.consultationType || 'video',
      status: 'scheduled',
      videoCall: {
        roomName: tempRoomName,
        password: tempPassword,
        createdAt: new Date()
      }
    });

    // Save the appointment to get the ID
    await appointment.save();

    // Now update with permanent room name using the appointment ID
    appointment.videoCall.roomName = `appointment-${appointment._id}`;
    await appointment.save();

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment created successfully'
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get call details for a specific appointment
router.get('/:id/call-details', auth, async (req, res) => {
  try {
    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      $or: [{ doctor: req.user._id }, { patient: req.user._id }]
    }).populate('doctor', 'name email').populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or access denied' });
    }

    if (!appointment.videoCall) {
      return res.status(400).json({ error: 'This appointment has no video call setup' });
    }

    // Check if the call is within the allowed time window
    if (!isWithinCallWindow(appointment)) {
      return res.status(403).json({ 
        error: 'Call is not available at this time',
        availableWindow: getCallWindowMessage(appointment)
      });
    }

    // Return call details
    res.json({
      success: true,
      roomName: appointment.videoCall.roomName,
      password: appointment.videoCall.password,
      appointment: {
        id: appointment._id,
        doctor: appointment.doctor,
        patient: appointment.patient,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error getting call details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to check if current time is within call window
function isWithinCallWindow(appointment) {
  try {
    const now = DateTime.now().setZone('UTC');
    
    // Parse appointment date (format: DD_MM_YYYY)
    const [day, month, year] = appointment.slotDate.split('_').map(Number);
    
    // Parse appointment time (format: HH:MM AM/PM)
    const [time, period] = appointment.slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create Luxon DateTime for appointment time
    const appointmentTime = DateTime.fromObject({
      year, 
      month, 
      day,
      hour: hours,
      minute: minutes,
      zone: 'UTC'
    });
    
    // Define call window (15 mins before to 30 mins after appointment time)
    const startWindow = appointmentTime.minus({ minutes: 15 });
    const endWindow = appointmentTime.plus({ minutes: 30 });
    
    return now >= startWindow && now <= endWindow;
  } catch (error) {
    console.error('Error checking call window:', error);
    return false;
  }
}

// Helper function to generate human-readable call window message
function getCallWindowMessage(appointment) {
  try {
    // Parse appointment date (format: DD_MM_YYYY)
    const [day, month, year] = appointment.slotDate.split('_').map(Number);
    
    // Parse appointment time (format: HH:MM AM/PM)
    const [time, period] = appointment.slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create Luxon DateTime for appointment time
    const appointmentTime = DateTime.fromObject({
      year, 
      month, 
      day,
      hour: hours,
      minute: minutes,
      zone: 'UTC'
    });
    
    // Calculate window
    const startWindow = appointmentTime.minus({ minutes: 15 });
    const endWindow = appointmentTime.plus({ minutes: 30 });
    
    return {
      start: startWindow.toLocaleString(DateTime.DATETIME_MED),
      end: endWindow.toLocaleString(DateTime.DATETIME_MED),
      currentTime: DateTime.now().toLocaleString(DateTime.DATETIME_MED)
    };
  } catch (error) {
    console.error('Error generating call window message:', error);
    return { error: 'Could not determine call window' };
  }
}

// Helper function to generate a random password
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Update appointment status (e.g., when call completes)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ doctor: req.user._id }, { patient: req.user._id }]
      },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or access denied' });
    }

    res.json({
      success: true,
      appointment,
      message: `Appointment marked as ${status}`
    });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;