// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const sendEmail = async (to, subject, message) => {
//   try {
//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // Use your email service provider (e.g., Gmail, Outlook, etc.)
//       auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS, // Your email password or app-specific password
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from:process.env.EMAIL_USER , // Sender's email address
//       to, // Recipient's email address
//       subject, // Email subject
//       text: message, // Email message
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//     return { success: true, message: 'Email sent successfully!' };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, message: 'Failed to send email.' };
//   }
// };

// export default sendEmail;

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email.' };
  }
};

export default sendEmail;

