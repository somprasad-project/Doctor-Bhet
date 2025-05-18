import cron from 'node-cron';
import appointmentModel from '../models/appointmentModel.js';
import sendEmail from '../utils/sendEmail.js';

// Helper to parse date and time from your DB format
function parseAppointmentDateTime(slotDate, slotTime) {
  // slotDate format: "12_5_2025"
  // slotTime format: "11:00 AM"
  const [day, month, year] = slotDate.split('_').map(Number);

  const [time, meridian] = slotTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (meridian === 'PM' && hours !== 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes);
}

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

  console.log(`Checking appointments at ${now.toISOString()}`);

  try {
    const appointments = await appointmentModel.find({
      cancelled: false,
      isCompleted: false,
      reminderSent: { $ne: true }, // Only those not reminded yet
    });

    for (const appointment of appointments) {
      const appointmentDateTime = parseAppointmentDateTime(appointment.slotDate, appointment.slotTime);
      console.log(`Appointment for ${appointment.userData.email} at ${appointmentDateTime.toISOString()}`);

      // Check if appointment is within 5 minutes ± 10 seconds window
      if (
        appointmentDateTime >= new Date(fiveMinutesLater.getTime() - 10 * 1000) &&
        appointmentDateTime <= new Date(fiveMinutesLater.getTime() + 10 * 1000)
      ) {
        console.log(`Sending reminder email to ${appointment.userData.email}...`);

        try {
          await sendEmail(
            appointment.userData.email,
            'Appointment Reminder',
            `Hello! This is a reminder that your appointment starts at ${appointmentDateTime.toLocaleString()}.`
          );

          // Mark reminder as sent
          await appointmentModel.findByIdAndUpdate(appointment._id, { reminderSent: true });

          console.log(`Reminder sent and updated for ${appointment.userData.email}`);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      } else {
        console.log('Appointment not within reminder window, skipping.');
      }
    }
  } catch (err) {
    console.error('Error fetching appointments:', err);
  }
});
