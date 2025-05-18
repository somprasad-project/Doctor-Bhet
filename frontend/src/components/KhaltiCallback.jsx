// import { useEffect, useContext } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { AppContext } from '../context/AppContext';

// const KhaltiCallback = () => {
//     const { backendUrl, token, getDoctorsData } = useContext(AppContext);
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();

//     const getPersistedSlotDetails = () => {
//         const details = localStorage.getItem('appointmentDetails');
//         console.log('Retrieved slot details:', details);
//         return details ? JSON.parse(details) : null;
//     };

//     const clearPersistedSlotDetails = () => {
//         console.log('Clearing persisted slot details');
//         localStorage.removeItem('appointmentDetails');
//     };

//     const checkSlotAvailability = async (docId, slotDate, slotTime) => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/user/check-slot`, {
//                 params: { docId, slotDate, slotTime },
//                 headers: { token },
//             });
//             return data.isAvailable;
//         } catch (error) {
//             console.error('Slot check error:', error);
//             return false;
//         }
//     };

//     const bookAppointmentRequest = async (slotDate, slotTime, consultationType, payment, docId) => {
//         try {
//             const isSlotAvailable = await checkSlotAvailability(docId, slotDate, slotTime);
//             if (!isSlotAvailable) {
//                 toast.error('Selected slot is no longer available');
//                 clearPersistedSlotDetails();
//                 navigate(`/appointment/${docId}`);
//                 return;
//             }

//             const { data } = await axios.post(
//                 `${backendUrl}/api/user/book-appointment`,
//                 { docId, slotDate, slotTime, consultationType, payment },
//                 { headers: { token } }
//             );

//             if (data.success) {
//                 toast.success(data.message);
//                 getDoctorsData();
//                 clearPersistedSlotDetails();
//                 navigate('/my-appointment');
//             } else {
//                 toast.error(data.message);
//                 clearPersistedSlotDetails();
//                 navigate(`/appointment/${docId}`);
//             }
//         } catch (error) {
//             console.error('Booking error:', error.response?.data);
//             toast.error(error.response?.data?.message || 'Booking failed');
//             clearPersistedSlotDetails();
//             navigate(`/appointment/${docId}`);
//         }
//     };

//     const verifyKhaltiPayment = async (pidx, amount, persistedDetails) => {
//         try {
//             const amountInPaisa = amount * 100;
//             console.log('Verifying Khalti payment:', {
//                 pidx,
//                 amountInPaisa,
//                 product_id: `appointment_${persistedDetails.docId}_${persistedDetails.slotDate}`,
//             });
//             const response = await fetch(`${backendUrl}/khalti/verify-khalti-payment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     pidx,
//                     amount: amountInPaisa,
//                     product_id: `appointment_${persistedDetails.docId}_${persistedDetails.slotDate}`,
//                 }),
//             });

//             const data = await response.json();
//             console.log('Khalti payment verification response:', data);

//             if (response.status === 200 && data.success) {
//                 if (persistedDetails.slotDate && persistedDetails.slotTime) {
//                     await bookAppointmentRequest(
//                         persistedDetails.slotDate,
//                         persistedDetails.slotTime,
//                         persistedDetails.consultationType,
//                         persistedDetails.payment,
//                         persistedDetails.docId
//                     );
//                 } else {
//                     toast.error('Invalid slot details for booking');
//                     clearPersistedSlotDetails();
//                     navigate(`/appointment/${persistedDetails.docId}`);
//                 }
//             } else {
//                 toast.error('Payment verification failed: ' + (data.message || 'Unknown error'));
//                 clearPersistedSlotDetails();
//                 navigate(`/appointment/${persistedDetails.docId}`);
//             }
//         } catch (error) {
//             console.error('Error verifying Khalti payment:', error);
//             toast.error('Payment verification failed: ' + (error.message || 'Network error'));
//             clearPersistedSlotDetails();
//             navigate(`/appointment/${persistedDetails.docId}`);
//         }
//     };

//     useEffect(() => {
//         const pidx = searchParams.get('pidx');
//         const amount = searchParams.get('amount');
//         const status = searchParams.get('status');
//         console.log('Khalti callback params:', { pidx, amount, status });

//         if (pidx && amount && status === 'Completed') {
//             const persistedDetails = getPersistedSlotDetails();
//             if (persistedDetails) {
//                 verifyKhaltiPayment(pidx, Number(amount), persistedDetails);
//             } else {
//                 toast.error('Invalid or missing appointment details');
//                 clearPersistedSlotDetails();
//                 navigate('/doctors');
//             }
//         } else if (pidx && status === 'Failed') {
//             toast.error('Payment failed');
//             clearPersistedSlotDetails();
//             const persistedDetails = getPersistedSlotDetails();
//             navigate(`/appointment/${persistedDetails?.docId || ''}`);
//         } else {
//             toast.error('Invalid payment callback');
//             clearPersistedSlotDetails();
//             navigate('/doctors');
//         }
//     }, [searchParams]);

//     return <div className="text-center py-8">Processing payment...</div>;
// };

// export default KhaltiCallback;