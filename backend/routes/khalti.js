// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import mongoose from 'mongoose'; // Assuming you're using Mongoose
// const router = express.Router();

// // Assuming Appointment model is defined
// const Appointment = mongoose.model('Appointment'); // Adjust based on your model import

// // Initiate Khalti payment
// router.post('/complete-khalti-payment', async (req, res) => {
//   console.log('complete-khalti-payment called');
//   const { product_id, buyer_name, amount } = req.body;
//   const convertedAmount = Number(amount) * 100; // Convert to paisa
//   try {
//     const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
//       method: 'POST',
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         return_url: `http://localhost:5173/my-appointment`,
//         website_url: `http://localhost:5173/my-appointment`,
//         amount: convertedAmount,
//         purchase_order_id: product_id,
//         purchase_order_name: buyer_name,
//       }),
//     });

//     console.log(response);
//     if (response.ok) {
//       const data = await response.json();
//       return res.status(200).json({
//         success: true,
//         message: data.payment_url,
//       });
//     } else {
//       throw new Error('Failed to initiate payment');
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to initiate payment',
//     });
//   }
// });

// // Verify Khalti payment and update appointment
// router.post('/verify-payment', async (req, res) => {
//   const { pidx } = req.body;
//   try {
//     const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
//       method: 'POST',
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ pidx }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (data.status === 'Completed') {
//         // Update appointment's payment status
//         const appointment = await Appointment.findOneAndUpdate(
//           { _id: data.purchase_order_id },
//           { payment: true },
//           { new: true }
//         );
//         if (!appointment) {
//           return res.status(404).json({
//             success: false,
//             message: 'Appointment not found',
//           });
//         }
//         return res.status(200).json({
//           success: true,
//           message: 'Payment verified successfully',
//         });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: 'Payment not completed',
//         });
//       }
//     } else {
//       throw new Error('Failed to verify payment');
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to verify payment',
//     });
//   }
// });

// export default router;


import dotenv from "dotenv";
dotenv.config();
import express from 'express'

const router = express.Router();


router.post("/complete-khalti-payment", async (req, res) => {
  console.log("complete-khalti-payment called")
  const {product_id,buyer_name,amount} = req.body
  const convertedAmount = Number(amount) * 100; // Convert to paisa
try {
  const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `http://localhost:5173/my-appointment`,
          website_url: `http://localhost:5173/my-appointment`,

          amount: convertedAmount,
          purchase_order_id: product_id,
          purchase_order_name: buyer_name,
        }),
      }
    );

    console.log(response);
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: data.payment_url,
      });
    }
  
} catch (error) {
  res.json({
    success: false,
    message: error.messs
  });
}
})


export default router;


// import dotenv from "dotenv";
// dotenv.config();
// import express from 'express';

// const router = express.Router();

// router.post("/complete-khalti-payment", async (req, res) => {
//     const { product_id, buyer_name, amount } = req.body;
//     if (!amount || isNaN(amount) || amount <= 0) {
//         return res.status(400).json({ success: false, message: "Invalid amount" });
//     }
//     const convertedAmount = Number(amount) * 100; // Convert to paisa
//     try {
//         const response = await fetch(
//             "https://a.khalti.com/api/v2/epayment/initiate/",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     return_url: `http://localhost:5173/my-appointment`, // Extract docId
//                     website_url: `http://localhost:5173//appointment/:docId`,
//                     amount: convertedAmount,
//                     purchase_order_id: product_id,
//                     purchase_order_name: buyer_name,
//                 }),
//             }
//         );

//         if (response.ok) {
//             const data = await response.json();
//             return res.status(200).json({
//                 success: true,
//                 message: data.payment_url,
//             });
//         } else {
//             const errorData = await response.json();
//             return res.status(response.status).json({
//                 success: false,
//                 message: errorData.message || 'Failed to initiate payment',
//             });
//         }
//     } catch (error) {
//         console.error('Error initiating Khalti payment:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || 'Server error',
//         });
//     }
// });

// router.post("/verify-khalti-payment", async (req, res) => {
//     const { pidx, amount, product_id } = req.body;
//     try {
//         const response = await fetch(
//             "https://a.khalti.com/api/v2/epayment/lookup/",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ pidx }),
//             }
//         );

//         const data = await response.json();
//         if (response.ok && data.status === "Completed") {
//             if (data.amount === amount) {
//                 return res.status(200).json({
//                     success: true,
//                     message: "Payment verified successfully",
//                     data,
//                 });
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Amount mismatch",
//                 });
//             }
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: data.message || "Payment verification failed",
//             });
//         }
//     } catch (error) {
//         console.error('Error verifying Khalti payment:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Server error",
//         });
//     }
// });

// export default router;

// import dotenv from "dotenv";
// dotenv.config();
// import express from 'express';
// import cors from 'cors';

// const router = express.Router();

// // Enable CORS for frontend (http://localhost:3000)
// router.use(cors({ origin: 'http://localhost:3000' }));

// router.post("/complete-khalti-payment", async (req, res) => {
//   console.log("complete-khalti-payment called with body:", req.body);
//   console.log("Request headers:", req.headers);
//   const { token, amount, product_id, product_identity, buyer_name } = req.body;

//   // Validate required fields
//   if (!token || !amount) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields: token and amount",
//     });
//   }

//   // Validate amount (minimum 1000 paisa)
//   if (amount < 1000) {
//     return res.status(400).json({
//       success: false,
//       message: "Amount must be at least 1000 paisa (NPR 10)",
//     });
//   }

//   // Validate KHALTI_SECRET_KEY
//   if (!process.env.KHALTI_SECRET_KEY) {
//     console.error("KHALTI_SECRET_KEY is not set in .env");
//     return res.status(500).json({
//       success: false,
//       message: "Server configuration error: Missing KHALTI_SECRET_KEY",
//     });
//   }

//   try {
//     const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
//       method: "POST",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token,
//         amount, // Amount in paisa
//       }),
//     });

//     const data = await response.json();
//     console.log("Khalti verification response:", JSON.stringify(data, null, 2));

//     if (response.ok && data.state?.name === "Completed") {
//       return res.status(200).json({
//         success: true,
//         message: "Payment verified successfully",
//         data: {
//           transaction_id: data.idx,
//           amount: data.amount,
//           buyer_name,
//           product_id,
//           product_identity,
//         },
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: data.error_message || "Payment verification failed",
//         error_details: data,
//       });
//     }
//   } catch (error) {
//     console.error("Error verifying Khalti payment:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// });

// export default router;

// import dotenv from "dotenv";
// dotenv.config();
// import express from 'express'

// const router = express.Router();


// router.post("/complete-khalti-payment", async (req, res) => {
//   console.log("complete-khalti-payment called")
//   const {product_id,buyer_name,amount} = req.body
//   const convertedAmount = Number(amount) * 100; // Convert to paisa
// try {
//   const response = await fetch(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           return_url: `http://localhost:5173/appointments`,
//           website_url: `http://localhost:5173/appointments`,

//           amount: convertedAmount,
//           purchase_order_id: product_id,
//           purchase_order_name: buyer_name,
//         }),
//       }
//     );

//     console.log(response);
//     if (response.ok) {
//       const data = await response.json();
//       return res.status(200).json({
//         success: true,
//         message: data.payment_url,
//       });
//     }
  
// } catch (error) {
//   res.json({
//     success: false,
//     message: error.messs
//   });
// }
// })


// export default router;