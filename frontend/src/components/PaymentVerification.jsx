// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const PaymentVerification = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [verifying, setVerifying] = useState(true);

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         const pidx = searchParams.get('pidx');
//         const appointmentId = searchParams.get('appointmentId');

//         if (!pidx || !appointmentId) {
//           throw new Error('Missing payment verification parameters');
//         }

//         const response = await axios.post('/api/payment/khalti/verify', {
//           pidx,
//           appointmentId
//         });

//         if (response.data.success) {
//           toast.success('Payment successful! Your appointment has been confirmed.');
//           navigate('/my-appointments');
//         } else {
//           throw new Error(response.data.message || 'Payment verification failed');
//         }
//       } catch (error) {
//         console.error('Payment verification error:', error);
//         toast.error(error.message || 'Failed to verify payment');
//         navigate('/my-appointments');
//       } finally {
//         setVerifying(false);
//       }
//     };

//     verifyPayment();
//   }, [searchParams, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Verifying your payment...</p>
//       </div>
//     </div>
//   );
// };

// export default PaymentVerification; 