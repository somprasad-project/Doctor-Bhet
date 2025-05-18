// // import React, { useContext, useEffect, useState } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import Swal from 'sweetalert2';
// // import khaltiLogo from '../assets/khalti.png';

// // const MyAppointments = () => {
// //     const { backendUrl, token, getDoctorsData } = useContext(AppContext);
// //     const [appointments, setAppointments] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [processingPayment, setProcessingPayment] = useState(false);

// //     const months = [" ", "Jan", "Feb", "Mar", "Apr", " May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

// //     const slotDateFormat = (slotDate) => {
// //         const dateArray = slotDate.split('_')
// //         return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
// //     }

// //     const getUserAppointments = async () => {
// //         try {
// //             const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
// //             if (data.success) {
// //                 setAppointments(data.appointments.reverse());
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to fetch appointments');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const cancelAppointment = async (appointmentId) => {
// //         try {
// //             // Show confirmation dialog using SweetAlert2
// //             const result = await Swal.fire({
// //                 title: 'Are you sure?',
// //                 text: 'Do you want to cancel this appointment?',
// //                 icon: 'warning',
// //                 showCancelButton: true,
// //                 confirmButtonColor: '#3085d6',
// //                 cancelButtonColor: '#d33',
// //                 confirmButtonText: 'Yes, cancel it!',
// //                 cancelButtonText: 'No, keep it'
// //             });

// //             // If the user confirms, proceed with cancellation
// //             if (result.isConfirmed) {
// //                 const { data } = await axios.post(
// //                     `${backendUrl}/api/user/cancel-appointment`,
// //                     { appointmentId },
// //                     { headers: { token } }
// //                 );

// //                 if (data.success) {
// //                     toast.success(data.message);
// //                     getUserAppointments(); // Refresh the appointments list
// //                     getDoctorsData(); // Refresh doctor data if needed
// //                 } else {
// //                     toast.error(data.message);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to cancel appointment');
// //         }
// //     };

// //     const handlePayment = async (appointment) => {
// //         try {
// //             setProcessingPayment(true);
            
// //             // Show simple button popup for Khalti payment
// //             const result = await Swal.fire({
// //                 title: 'Pay with Khalti',
// //                 html: `
// //                     <div class="flex items-center justify-center mb-4">
// //                         <img src="${khaltiLogo}" alt="Khalti" style="height: 50px; margin-right: 10px;">
// //                         <span class="text-lg font-medium">Pay with Khalti</span>
// //                     </div>
// //                     <p class="text-sm text-gray-600">Click the button below to proceed with Khalti payment.</p>
// //                 `,
// //                 showCancelButton: true,
// //                 confirmButtonText: 'Pay Now',
// //                 cancelButtonText: 'Cancel',
// //                 confirmButtonColor: '#5C61F0',
// //                 showConfirmButton: true,
// //                 focusConfirm: false
// //             });

// //             if (result.isConfirmed) {
// //                 // Initiate Khalti payment
// //                 const { data } = await axios.post(
// //                     `${backendUrl}/api/payment/khalti/initiate`,
// //                     {
// //                         amount: (appointment.amount || 1000) * 100, // Convert to paisa
// //                         appointmentId: appointment._id,
// //                         customerInfo: {
// //                             name: appointment.userData?.name || 'Patient',
// //                             email: appointment.userData?.email || 'patient@example.com',
// //                             phone: appointment.userData?.phone || '9800000000'
// //                         }
// //                     },
// //                     { headers: { token } }
// //                 );

// //                 if (data.success && data.payment_url) {
// //                     // Open Khalti payment URL in a new window
// //                     window.open(data.payment_url, '_blank');
                    
// //                     // Show success message
// //                     toast.success('Payment initiated. Please complete the payment in the new window.');
// //                 } else {
// //                     toast.error(data.message || 'Failed to initiate payment');
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Payment error:', error);
// //             toast.error(error.response?.data?.message || 'Failed to process payment');
// //         } finally {
// //             setProcessingPayment(false);
// //         }
// //     };




// //     useEffect(() => {
// //         if (token) {
// //             getUserAppointments();
// //         }
// //     }, [token]);

// //     if (loading) return <div>Loading...</div>;





// //     return (
// //         <div>
// //             <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

// //             {appointments.length === 0 ? (
// //                 <p className='text-zinc-600'>No appointments found.</p>
// //             ) : (
// //                 <div>
// //                     {appointments.map((item, index) => (
// //                         <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2.5 border-b' key={index}>
// //                             <div>
// //                                 <img className='w-40 bg-indigo-50' src={item.docData.image} alt={`Dr. ${item.docData.name}`} />
// //                             </div>

// //                             <div className='flex-1 text-sm text-zinc-600'>
// //                                 <p className='text-netural-800 font-semibold'>{item.docData.name}</p>
// //                                 <p>{item.docData.speciality}</p>
// //                                 <p className='text-zinc-700 font-medium mt-2.5'>Address:</p>
// //                                 <p className='text-xs'>{item.docData.address.line1}</p>
// //                                 <p className='text-xs'>{item.docData.address.line2}</p>
// //                                 <p className='text-xs mt-2.5'>
// //                                     <span className='text-sm text-netural-700 font-medium'>Date & Time: </span>
// //                                     {slotDateFormat(item.slotDate)} | {item.slotTime}
// //                                 </p>
// //                             </div>

// //                             <div className='flex flex-col gap-2 justify-end'>
// //                                 {!item.cancelled && (
// //                                     <button 
// //                                         className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
// //                                         onClick={() => handlePayment(item)}
// //                                         disabled={processingPayment}
// //                                     >
// //                                         {processingPayment ? 'Processing...' : 'Pay Online'}
// //                                     </button>
// //                                 )}
// //                                 {!item.cancelled && (
// //                                     <button
// //                                         onClick={() => cancelAppointment(item._id)}
// //                                         className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
// //                                     >
// //                                         Cancel Appointment
// //                                     </button>
// //                                 )}
// //                                 {item.cancelled && (
// //                                     <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
// //                                         Appointment Cancelled
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default MyAppointments;




// // import React, { useContext, useEffect, useState } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import Swal from 'sweetalert2';

// // const MyAppointments = () => {
// //     const { backendUrl, token, getDoctorsData } = useContext(AppContext);
// //     const [appointments, setAppointments] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// //     const slotDateFormat = (slotDate) => {
// //         const dateArray = slotDate.split('_');
// //         return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
// //     };

// //     const getUserAppointments = async () => {
// //         try {
// //             const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
// //                 headers: { token },
// //             });
// //             if (data.success) {
// //                 setAppointments(data.appointments.reverse());
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to fetch appointments');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const cancelAppointment = async (appointmentId) => {
// //         try {
// //             const result = await Swal.fire({
// //                 title: 'Are you sure?',
// //                 text: 'Do you want to cancel this appointment?',
// //                 icon: 'warning',
// //                 showCancelButton: true,
// //                 confirmButtonColor: '#3085d6',
// //                 cancelButtonColor: '#d33',
// //                 confirmButtonText: 'Yes, cancel it!',
// //                 cancelButtonText: 'No, keep it',
// //             });

// //             if (result.isConfirmed) {
// //                 const { data } = await axios.post(
// //                     `${backendUrl}/api/user/cancel-appointment`,
// //                     { appointmentId },
// //                     { headers: { token } }
// //                 );

// //                 if (data.success) {
// //                     toast.success(data.message);
// //                     getUserAppointments(); // Refresh list
// //                     getDoctorsData(); // Optional
// //                 } else {
// //                     toast.error(data.message);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to cancel appointment');
// //         }
// //     };

// //     useEffect(() => {
// //         if (token) {
// //             getUserAppointments();
// //         }
// //     }, [token]);

// //     if (loading) return <div>Loading...</div>;

// //     return (
// //         <div>
// //             <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

// //             {appointments.length === 0 ? (
// //                 <p className='text-zinc-600'>No appointments found.</p>
// //             ) : (
// //                 <div>
// //                     {appointments.map((item, index) => (
// //                         <div
// //                             className='flex flex-col md:flex-row justify-between items-center gap-4 border rounded p-4 shadow-sm mb-4'
// //                             key={index}
// //                         >
// //                             {/* Left: Doctor Info */}
// //                             <div className='flex items-center gap-4'>
// //                                 <img
// //                                     className='w-16 h-16 rounded-full object-cover'
// //                                     src={item.docData.image}
// //                                     alt={`Dr. ${item.docData.name}`}
// //                                 />
// //                                 <div>
// //                                     <p className='text-base font-semibold text-zinc-800'>
// //                                         {item.docData.name}
// //                                     </p>
// //                                     <p className='text-sm text-zinc-500'>{item.docData.speciality}</p>
// //                                     <div className='flex gap-2 mt-1'>
// //                                         <span className={`text-xs px-2 py-0.5 border rounded-full ${
// //                                             item.appointmentType === 'video'
// //                                                 ? 'text-blue-600 border-blue-500'
// //                                                 : 'text-green-600 border-green-500'
// //                                         }`}>
// //                                             {item.appointmentType === 'video' ? 'Video' : 'In-Person'}
// //                                         </span>
// //                                         <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
// //                                             item.confirmed ? 'bg-green-600' : 'bg-yellow-500'
// //                                         }`}>
// //                                             {item.confirmed ? 'Confirmed' : 'Pending'}
// //                                         </span>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             {/* Middle: Date & Time */}
// //                             <div className='text-right md:text-center'>
// //                                 <p className='text-sm font-semibold text-gray-700'>
// //                                     {slotDateFormat(item.slotDate)}
// //                                 </p>
// //                                 <p className='text-xs text-gray-500'>{item.slotTime}</p>
// //                             </div>

// //                             {/* Right: Action Buttons */}
// //                             <div className='flex gap-2 mt-2 md:mt-0'>
// //                                 {!item.cancelled ? (
// //                                     <>
// //                                         <button
// //                                             className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded'
// //                                             onClick={() => window.open(item.joinLink || '#', '_blank')}
// //                                         >
// //                                             Join Call
// //                                         </button>
// //                                         <button
// //                                             onClick={() => cancelAppointment(item._id)}
// //                                             className='bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded'
// //                                         >
// //                                             Cancel
// //                                         </button>
// //                                     </>
// //                                 ) : (
// //                                     <button className='border border-red-500 text-red-500 px-4 py-2 rounded text-sm'>
// //                                         Appointment Cancelled
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default MyAppointments;


// // import React, { useContext, useEffect, useState } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import Swal from 'sweetalert2';

// // const MyAppointments = () => {
// //     const { backendUrl, token, getDoctorsData } = useContext(AppContext);
// //     const [appointments, setAppointments] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// //     const slotDateFormat = (slotDate) => {
// //         const dateArray = slotDate.split('_');
// //         return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
// //     };

// //     const getUserAppointments = async () => {
// //         try {
// //             const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
// //                 headers: { token },
// //             });
// //             if (data.success) {
// //                 setAppointments(data.appointments.reverse());
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to fetch appointments');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const cancelAppointment = async (appointmentId) => {
// //         try {
// //             const result = await Swal.fire({
// //                 title: 'Are you sure?',
// //                 text: 'Do you want to cancel this appointment?',
// //                 icon: 'warning',
// //                 showCancelButton: true,
// //                 confirmButtonColor: '#3085d6',
// //                 cancelButtonColor: '#d33',
// //                 confirmButtonText: 'Yes, cancel it!',
// //                 cancelButtonText: 'No, keep it',
// //             });

// //             if (result.isConfirmed) {
// //                 const { data } = await axios.post(
// //                     `${backendUrl}/api/user/cancel-appointment`,
// //                     { appointmentId },
// //                     { headers: { token } }
// //                 );

// //                 if (data.success) {
// //                     toast.success(data.message);
// //                     getUserAppointments();
// //                     getDoctorsData();
// //                 } else {
// //                     toast.error(data.message);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error(error.response?.data?.message || 'Failed to cancel appointment');
// //         }
// //     };

// //     useEffect(() => {
// //         if (token) {
// //             getUserAppointments();
// //         }
// //     }, [token]);

// //     // SVG Icons
// //     const CalendarIcon = () => (
// //         <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //         </svg>
// //     );

// //     const ClockIcon = () => (
// //         <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //         </svg>
// //     );

// //     const VideoIcon = () => (
// //         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
// //         </svg>
// //     );

// //     const LocationIcon = () => (
// //         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
// //         </svg>
// //     );

// //     const UserIcon = () => (
// //         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
// //         </svg>
// //     );

// //     const CancelIcon = () => (
// //         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //         </svg>
// //     );

// //     if (loading) return (
// //         <div className="flex justify-center items-center h-64">
// //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //         </div>
// //     );

// //     return (
// //         <div className="max-w-6xl mx-auto px-4 py-8">
// //             <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
            
// //             {appointments.length === 0 ? (
// //                 <div className="bg-white rounded-lg shadow p-6 text-center">
// //                     <div className="text-gray-400 mb-4">
// //                         <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //                         </svg>
// //                     </div>
// //                     <h3 className="text-lg font-medium text-gray-700 mb-2">No appointments scheduled</h3>
// //                     <p className="text-gray-500">You don't have any upcoming appointments.</p>
// //                 </div>
// //             ) : (
// //                 <div className="space-y-4">
// //                     {appointments.map((item, index) => (
// //                         <div 
// //                             key={index} 
// //                             className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
// //                                 item.cancelled ? 'border-gray-300' : 
// //                                 item.confirmed ? 'border-green-500' : 'border-yellow-400'
// //                             }`}
// //                         >
// //                             <div className="p-5">
// //                                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                                     {/* Doctor Info */}
// //                                     <div className="flex items-start gap-4">
// //                                         <img
// //                                             className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
// //                                             src={item.docData.image}
// //                                             alt={`Dr. ${item.docData.name}`}
// //                                         />
// //                                         <div>
// //                                             <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
// //                                             <p className="text-sm text-gray-600">{item.docData.speciality}</p>
                                            
// //                                             <div className="flex items-center mt-2 space-x-2">
// //                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                                                     item.appointmentType === 'video' 
// //                                                         ? 'bg-blue-100 text-blue-800' 
// //                                                         : 'bg-purple-100 text-purple-800'
// //                                                 }`}>
// //                                                     {item.appointmentType === 'video' ? (
// //                                                         <>
// //                                                             <VideoIcon />
// //                                                             Video Consultation
// //                                                         </>
// //                                                     ) : (
// //                                                         <>
// //                                                             <LocationIcon />
// //                                                             In-Person
// //                                                         </>
// //                                                     )}
// //                                                 </span>
                                                
// //                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                                                     item.cancelled 
// //                                                         ? 'bg-gray-100 text-gray-800' 
// //                                                         : item.confirmed 
// //                                                             ? 'bg-green-100 text-green-800' 
// //                                                             : 'bg-yellow-100 text-yellow-800'
// //                                                 }`}>
// //                                                     {item.cancelled ? 'Cancelled' : item.confirmed ? 'Confirmed' : 'Pending'}
// //                                                 </span>
// //                                             </div>
// //                                         </div>
// //                                     </div>
                                    
// //                                     {/* Appointment Details */}
// //                                     <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
// //                                         <div className="flex items-center text-gray-700">
// //                                             <CalendarIcon />
// //                                             <span>{slotDateFormat(item.slotDate)}</span>
// //                                         </div>
// //                                         <div className="flex items-center text-gray-700">
// //                                             <ClockIcon />
// //                                             <span>{item.slotTime}</span>
// //                                         </div>
// //                                     </div>
                                    
// //                                     {/* Actions */}
// //                                     <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
// //                                         {!item.cancelled ? (
// //                                             <>
// //                                                 <button
// //                                                     onClick={() => window.open(item.joinLink || '#', '_blank')}
// //                                                     className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
// //                                                         item.appointmentType === 'video' 
// //                                                             ? 'bg-blue-600 hover:bg-blue-700 text-white' 
// //                                                             : 'bg-purple-600 hover:bg-purple-700 text-white'
// //                                                     }`}
// //                                                     disabled={!item.confirmed}
// //                                                 >
// //                                                     {item.appointmentType === 'video' ? (
// //                                                         <>
// //                                                             <VideoIcon />
// //                                                             Join Call
// //                                                         </>
// //                                                     ) : (
// //                                                         <>
// //                                                             <UserIcon />
// //                                                             View Details
// //                                                         </>
// //                                                     )}
// //                                                 </button>
// //                                                 <button
// //                                                     onClick={() => cancelAppointment(item._id)}
// //                                                     className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
// //                                                     disabled={item.cancelled}
// //                                                 >
// //                                                     <CancelIcon />
// //                                                     Cancel
// //                                                 </button>
// //                                             </>
// //                                         ) : (
// //                                             <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
// //                                                 Appointment Cancelled
// //                                             </span>
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default MyAppointments;

// // import React, { useContext, useEffect, useState, useMemo } from 'react';
// // import { AppContext } from '../context/AppContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';
// // import Swal from 'sweetalert2';

// // // Icons component for better organization
// // const Icons = {
// //   Calendar: () => (
// //     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //     </svg>
// //   ),
// //   Clock: () => (
// //     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //     </svg>
// //   ),
// //   Video: () => (
// //     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
// //     </svg>
// //   ),
// //   Location: () => (
// //     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
// //     </svg>
// //   ),
// //   User: () => (
// //     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
// //     </svg>
// //   ),
// //   Cancel: () => (
// //     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //     </svg>
// //   )
// // };

// // const MyAppointments = () => {
// //   const { backendUrl, token, getDoctorsData } = useContext(AppContext);
// //   const [appointments, setAppointments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('upcoming');

// //   const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// //   const slotDateFormat = (slotDate) => {
// //     const dateArray = slotDate.split('_');
// //     return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
// //   };

// //   const getUserAppointments = async () => {
// //     try {
// //       const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
// //         headers: { token },
// //       });
// //       console.log('Appointments data:', data.appointments); // Debug log
      
// //       if (data.success) {
// //         // Normalize consultation types if needed
// //         const normalizedAppointments = data.appointments.map(appt => ({
// //           ...appt,
// //           consultationType: appt.consultationType?.toLowerCase().includes('video') ? 'video' : 'in-person'
// //         }));
        
// //         setAppointments(normalizedAppointments.reverse());
// //       }
// //     } catch (error) {
// //       console.error('Error fetching appointments:', error);
// //       toast.error(error.response?.data?.message || 'Failed to fetch appointments');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const cancelAppointment = async (appointmentId) => {
// //     try {
// //       const result = await Swal.fire({
// //         title: 'Are you sure?',
// //         text: 'Do you want to cancel this appointment?',
// //         icon: 'warning',
// //         showCancelButton: true,
// //         confirmButtonColor: '#3085d6',
// //         cancelButtonColor: '#d33',
// //         confirmButtonText: 'Yes, cancel it!',
// //         cancelButtonText: 'No, keep it',
// //       });

// //       if (result.isConfirmed) {
// //         const { data } = await axios.post(
// //           `${backendUrl}/api/user/cancel-appointment`,
// //           { appointmentId },
// //           { headers: { token } }
// //         );

// //         if (data.success) {
// //           toast.success(data.message);
// //           getUserAppointments();
// //           getDoctorsData();
// //         } else {
// //           toast.error(data.message);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error cancelling appointment:', error);
// //       toast.error(error.response?.data?.message || 'Failed to cancel appointment');
// //     }
// //   };

// //   useEffect(() => {
// //     if (token) {
// //       getUserAppointments();
// //     }
// //   }, [token]);

// //   const categorizeAppointments = useMemo(() => {
// //     const now = new Date();
    
// //     return appointments.reduce((acc, appointment) => {
// //       const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //       const [time, period] = appointment.slotTime.split(' ');
// //       let [hours, minutes] = time.split(':').map(Number);
      
// //       if (period === 'PM' && hours !== 12) hours += 12;
// //       if (period === 'AM' && hours === 12) hours = 0;
      
// //       const appointmentDate = new Date(year, month - 1, day, hours, minutes);
      
// //       if (appointment.cancelled) {
// //         acc.cancelled.push(appointment);
// //       } else if (appointmentDate > now) {
// //         acc.upcoming.push(appointment);
// //       } else {
// //         acc.past.push(appointment);
// //       }
      
// //       return acc;
// //     }, { upcoming: [], past: [], cancelled: [] });
// //   }, [appointments]);

// //   const { upcoming, past, cancelled } = categorizeAppointments;

// //   const renderAppointmentCard = (item, index) => (
// //     <div 
// //       key={index} 
// //       className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
// //         item.cancelled ? 'border-gray-300' : 
// //         item.confirmed ? 'border-green-500' : 'border-yellow-400'
// //       }`}
// //     >
// //       <div className="p-5">
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //           {/* Doctor Info */}
// //           <div className="flex items-start gap-4">
// //             <img
// //               className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
// //               src={item.docData.image}
// //               alt={`Dr. ${item.docData.name}`}
// //             />
// //             <div>
// //               <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
// //               <p className="text-sm text-gray-600">{item.docData.speciality}</p>
              
// //               <div className="flex items-center mt-2 space-x-2">
// //                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                   item.consultationType === 'video' 
// //                     ? 'bg-blue-100 text-blue-800' 
// //                     : 'bg-purple-100 text-purple-800'
// //                 }`}>
// //                   {item.consultationType === 'video' ? (
// //                     <>
// //                       <Icons.Video />
// //                       Video Consultation
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Icons.Location />
// //                       In-Person Visit
// //                     </>
// //                   )}
// //                 </span>
                
// //                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                   item.cancelled 
// //                     ? 'bg-gray-100 text-gray-800' 
// //                     : item.confirmed 
// //                         ? 'bg-green-100 text-green-800' 
// //                         : 'bg-yellow-100 text-yellow-800'
// //                 }`}>
// //                   {item.cancelled ? 'Cancelled' : item.confirmed ? 'Confirmed' : 'Pending'}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
          
// //           {/* Appointment Details */}
// //           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
// //             <div className="flex items-center text-gray-700">
// //               <Icons.Calendar />
// //               <span>{slotDateFormat(item.slotDate)}</span>
// //             </div>
// //             <div className="flex items-center text-gray-700">
// //               <Icons.Clock />
// //               <span>{item.slotTime}</span>
// //             </div>
// //           </div>
          
// //           {/* Actions */}
// //           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
// //             {!item.cancelled && activeTab === 'upcoming' ? (
// //               <>
// //                 {item.consultationType === 'video' && (
// //                   <button
// //                     onClick={() => window.open(item.joinLink || '#', '_blank')}
// //                     className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
// //                     disabled={!item.confirmed}
// //                   >
// //                     <Icons.Video />
// //                     Join Call
// //                   </button>
// //                 )}
// //                 <button
// //                   onClick={() => cancelAppointment(item._id)}
// //                   className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
// //                 >
// //                   <Icons.Cancel />
// //                   Cancel
// //                 </button>
// //               </>
// //             ) : item.cancelled ? (
// //               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
// //                 Appointment Cancelled
// //               </span>
// //             ) : (
// //               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
// //                 Appointment Completed
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (loading) return (
// //     <div className="flex justify-center items-center h-64">
// //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //     </div>
// //   );

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
// //       {/* Tabs */}
// //       <div className="border-b border-gray-200 mb-6">
// //         <nav className="-mb-px flex space-x-8">
// //           <button
// //             onClick={() => setActiveTab('upcoming')}
// //             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
// //               activeTab === 'upcoming'
// //                 ? 'border-blue-500 text-blue-600'
// //                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //             }`}
// //           >
// //             Upcoming ({upcoming.length})
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('past')}
// //             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
// //               activeTab === 'past'
// //                 ? 'border-blue-500 text-blue-600'
// //                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //             }`}
// //           >
// //             Past ({past.length})
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('cancelled')}
// //             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
// //               activeTab === 'cancelled'
// //                 ? 'border-blue-500 text-blue-600'
// //                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //             }`}
// //           >
// //             Cancelled ({cancelled.length})
// //           </button>
// //         </nav>
// //       </div>
      
// //       {appointments.length === 0 ? (
// //         <div className="bg-white rounded-lg shadow p-6 text-center">
// //           <div className="text-gray-400 mb-4">
// //             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //             </svg>
// //           </div>
// //           <h3 className="text-lg font-medium text-gray-700 mb-2">No appointments scheduled</h3>
// //           <p className="text-gray-500">You don't have any upcoming appointments.</p>
// //         </div>
// //       ) : (
// //         <div className="space-y-4">
// //           {/* Render appointments based on active tab */}
// //           {activeTab === 'upcoming' && upcoming.length > 0 && (
// //             <div className="space-y-4">
// //               {upcoming.map((item, index) => renderAppointmentCard(item, index))}
// //             </div>
// //           )}
          
// //           {activeTab === 'past' && past.length > 0 && (
// //             <div className="space-y-4">
// //               {past.map((item, index) => renderAppointmentCard(item, index))}
// //             </div>
// //           )}
          
// //           {activeTab === 'cancelled' && cancelled.length > 0 && (
// //             <div className="space-y-4">
// //               {cancelled.map((item, index) => renderAppointmentCard(item, index))}
// //             </div>
// //           )}
          
// //           {/* Empty state for active tab */}
// //           {((activeTab === 'upcoming' && upcoming.length === 0) ||
// //             (activeTab === 'past' && past.length === 0) ||
// //             (activeTab === 'cancelled' && cancelled.length === 0)) && (
// //             <div className="bg-white rounded-lg shadow p-6 text-center">
// //               <div className="text-gray-400 mb-4">
// //                 <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //                 </svg>
// //               </div>
// //               <h3 className="text-lg font-medium text-gray-700 mb-2">
// //                 {activeTab === 'upcoming' 
// //                   ? 'No upcoming appointments' 
// //                   : activeTab === 'past' 
// //                     ? 'No past appointments' 
// //                     : 'No cancelled appointments'}
// //               </h3>
// //               <p className="text-gray-500">
// //                 {activeTab === 'upcoming' 
// //                   ? 'You don\'t have any upcoming appointments scheduled.' 
// //                   : activeTab === 'past' 
// //                     ? 'You don\'t have any past appointments.' 
// //                     : 'You haven\'t cancelled any appointments.'}
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MyAppointments;

// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import VideoCall from '../components/VideoCall';

// const Icons = {
//   Calendar: () => (
//     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//     </svg>
//   ),
//   Clock: () => (
//     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//     </svg>
//   ),
//   Video: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
//     </svg>
//   ),
//   Location: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//     </svg>
//   ),
//   User: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//     </svg>
//   ),
//   Cancel: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//     </svg>
//   ),
// };

// const MyAppointments = () => {
//   const { backendUrl, token, getDoctorsData, currentUser } = useContext(AppContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [activeVideoCall, setActiveVideoCall] = useState(null);
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [hasCachedData, setHasCachedData] = useState(false);

//   const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

//   const slotDateFormat = (slotDate) => {
//     const dateArray = slotDate.split('_');
//     return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
//   };

//   const getUserAppointments = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
//         headers: { token },
//       });

//       if (data.success) {
//         const normalizedAppointments = data.appointments.map((appt) => ({
//           ...appt,
//           consultationType: appt.consultationType?.toLowerCase().includes('video') ? 'video' : 'in-person',
//         }));

//         setAppointments(normalizedAppointments.reverse());
//         setHasCachedData(true);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'Do you want to cancel this appointment?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, cancel it!',
//         cancelButtonText: 'No, keep it',
//       });

//       if (result.isConfirmed) {
//         const { data } = await axios.post(
//           `${backendUrl}/api/user/cancel-appointment`,
//           { appointmentId },
//           { headers: { token } }
//         );

//         if (data.success) {
//           toast.success(data.message);
//           getUserAppointments();
//           getDoctorsData();
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error) {
//       console.error('Error cancelling appointment:', error);
//       toast.error(error.response?.data?.message || 'Failed to cancel appointment');
//     }
//   };

//   const handleCallEnd = (appointmentId) => {
//     setShowVideoModal(false);
//     setActiveVideoCall(null);
//     toast.success('Video consultation completed');
//     getUserAppointments();
//   };

//   const canStartVideoCall = (appointment) => {
//     if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) return false;

//     const now = new Date();
//     const [day, month, year] = appointment.slotDate.split('_').map(Number);
//     const [time, period] = appointment.slotTime.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (period === 'PM' && hours !== 12) hours += 12;
//     if (period === 'AM' && hours === 12) hours = 0;

//     const appointmentDate = new Date(year, month - 1, day, hours, minutes);
//     const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
//     const endWindow = new Date(appointmentDate.getTime() + 30 * 60000);

//     return now >= startWindow && now <= endWindow;
//   };

//   const getTimeWindowMessage = (appointment) => {
//     if (!appointment.slotDate || !appointment.slotTime) return '';

//     const [day, month, year] = appointment.slotDate.split('_').map(Number);
//     const [time, period] = appointment.slotTime.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (period === 'PM' && hours !== 12) hours += 12;
//     if (period === 'AM' && hours === 12) hours = 0;

//     const appointmentDate = new Date(year, month - 1, day, hours, minutes);
//     const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
//     const endWindow = new Date(appointmentDate.getTime() + 30 * 60000);

//     return `The video portal will be available from ${startWindow.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     })} to ${endWindow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   const confirmVideoCall = async (appointment) => {
//     if (!canStartVideoCall(appointment)) {
//       Swal.fire({
//         title: 'Call Not Available Yet',
//         html: `
//           <div class="text-left">
//             <p class="mb-2">The video consultation is not available at this time.</p>
//             <p class="text-sm text-gray-600">${getTimeWindowMessage(appointment)}</p>
//             <p class="mt-2 text-sm">Please try again during your scheduled appointment window.</p>
//           </div>
//         `,
//         icon: 'info',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#3085d6',
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/jitsi-token`,
//         {
//           appointmentId: appointment._id,
//           userId: appointment.userId,
//           userName: currentUser?.name || 'Patient',
//         },
//         { headers: { token } }
//       );

//       if (!response.data.success) {
//         toast.error(response.data.message || 'Failed to initiate video call');
//         return;
//       }

//       Swal.fire({
//         title: 'Ready to Join?',
//         html: `
//           <div class="text-left">
//             <p>You're about to join your video consultation with Dr. ${appointment.docData.name}.</p>
//             <p class="mt-2 text-sm text-gray-600">Please ensure you're in a quiet, well-lit environment.</p>
//           </div>
//         `,
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Join Now',
//         cancelButtonText: 'Not Yet',
//         confirmButtonColor: '#3085d6',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           setActiveVideoCall({ ...appointment, jitsiToken: response.data.token });
//           setShowVideoModal(true);
//         }
//       });
//     } catch (error) {
//       console.error('Error initiating video call:', error);
//       toast.error('Failed to initiate video call');
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       getUserAppointments();
//     }
//   }, [token]);

//   const categorizeAppointments = useMemo(() => {
//     const now = new Date();

//     return appointments.reduce(
//       (acc, appointment) => {
//         const [day, month, year] = appointment.slotDate.split('_').map(Number);
//         const [time, period] = appointment.slotTime.split(' ');
//         let [hours, minutes] = time.split(':').map(Number);

//         if (period === 'PM' && hours !== 12) hours += 12;
//         if (period === 'AM' && hours === 12) hours = 0;

//         const appointmentDate = new Date(year, month - 1, day, hours, minutes);

//         if (appointment.cancelled) {
//           acc.cancelled.push(appointment);
//         } else if (appointment.isCompleted) {
//           acc.past.push(appointment);
//         } else if (appointmentDate > now) {
//           acc.upcoming.push(appointment);
//         } else {
//           acc.past.push(appointment);
//         }

//         return acc;
//       },
//       { upcoming: [], past: [], cancelled: [] }
//     );
//   }, [appointments]);

//   const { upcoming, past, cancelled } = categorizeAppointments;

//   const renderAppointmentCard = (item, index) => (
//     <div
//       key={index}
//       className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
//         item.cancelled
//           ? 'border-gray-300'
//           : item.isCompleted
//           ? 'border-green-500'
//           : item.confirmed
//           ? 'border-green-500'
//           : 'border-yellow-400'
//       }`}
//     >
//       <div className="p-5">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-start gap-4">
//             <img
//               className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
//               src={item.docData.image}
//               alt={`Dr. ${item.docData.name}`}
//               onError={(e) => (e.target.src = '/default-doctor.png')}
//             />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
//               <p className="text-sm text-gray-600">{item.docData.speciality}</p>

//               <div className="flex items-center mt-2 space-x-2">
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     item.consultationType === 'video'
//                       ? 'bg-blue-100 text-blue-800'
//                       : 'bg-purple-100 text-purple-800'
//                   }`}
//                 >
//                   {item.consultationType === 'video' ? (
//                     <>
//                       <Icons.Video />
//                       Video Consultation
//                     </>
//                   ) : (
//                     <>
//                       <Icons.Location />
//                       In-Person Visit
//                     </>
//                   )}
//                 </span>

//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     item.cancelled
//                       ? 'bg-gray-100 text-gray-800'
//                       : item.isCompleted
//                       ? 'bg-green-100 text-green-800'
//                       : item.confirmed
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}
//                 >
//                   {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : item.confirmed ? 'Confirmed' : 'Pending'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
//             <div className="flex items-center text-gray-700">
//               <Icons.Calendar />
//               <span>{slotDateFormat(item.slotDate)}</span>
//             </div>
//             <div className="flex items-center text-gray-700">
//               <Icons.Clock />
//               <span>{item.slotTime}</span>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
//             {!item.cancelled && !item.isCompleted && activeTab === 'upcoming' ? (
//               <>
//                 {item.consultationType === 'video' && (
//                   <button
//                     onClick={() => confirmVideoCall(item)}
//                     className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
//                       canStartVideoCall(item) && item.confirmed
//                         ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                     }`}
//                     disabled={!canStartVideoCall(item) || !item.confirmed}
//                   >
//                     <Icons.Video />
//                     Join Call
//                   </button>
//                 )}
//                 <button
//                   onClick={() => cancelAppointment(item._id)}
//                   className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
//                 >
//                   <Icons.Cancel />
//                   Cancel
//                 </button>
//               </>
//             ) : item.cancelled ? (
//               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
//                 Appointment Cancelled
//               </span>
//             ) : (
//               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
//                 Appointment Completed
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading && !hasCachedData)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

//       <div className="border-b border-gray-200 mb-6">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setActiveTab('upcoming')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'upcoming'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Upcoming ({upcoming.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('past')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'past'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Past ({past.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('cancelled')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'cancelled'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Cancelled ({cancelled.length})
//           </button>
//         </nav>
//       </div>

//       {appointments.length === 0 ? (
//         <div className="text-center text-gray-500 py-12">
//           <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             ></path>
//           </svg>
//           <p className="mt-4 text-lg">You have no appointments at the moment.</p>
//           <p className="mt-1 text-sm">When you schedule an appointment, it will appear here.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {activeTab === 'upcoming' && upcoming.length > 0 && (
//             <div className="space-y-4">{upcoming.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}

//           {activeTab === 'past' && past.length > 0 && (
//             <div className="space-y-4">{past.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}

//           {activeTab === 'cancelled' && cancelled.length > 0 && (
//             <div className="space-y-4">{cancelled.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}

//           {((activeTab === 'upcoming' && upcoming.length === 0) ||
//             (activeTab === 'past' && past.length === 0) ||
//             (activeTab === 'cancelled' && cancelled.length === 0)) && (
//             <div className="text-center text-gray-500 py-12">
//               <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 ></path>
//               </svg>
//               <p className="mt-4 text-lg">
//                 {activeTab === 'upcoming'
//                   ? 'No upcoming appointments'
//                   : activeTab === 'past'
//                   ? 'No past appointments'
//                   : 'No cancelled appointments'}
//               </p>
//               <p className="mt-1 text-sm">
//                 {activeTab === 'upcoming'
//                   ? 'When you schedule an appointment, it will appear here.'
//                   : activeTab === 'past'
//                   ? 'Your completed appointments will appear here.'
//                   : 'Cancelled appointments will appear here.'}
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {showVideoModal && activeVideoCall && (
//         <VideoCall
//           appointment={activeVideoCall}
//           onClose={() => handleCallEnd(activeVideoCall._id)}
//           userInfo={{
//             name: currentUser?.name || 'Patient',
//             email: currentUser?.email || 'patient@example.com',
//           }}
//           isDoctor={false}
//         />
//       )}
//     </div>
//   );
// };

// export default MyAppointments;


// working
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import VideoCall from '../components/VideoCall';
import khaltiLogo from '../assets/khalti.png';
import KhaltiCheckout from 'khalti-checkout-web';

const Icons = {
  Calendar: () => (
    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Video: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
  ),
  Location: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 -major-tick-4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  ),
  Cancel: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Payment: () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
  ),
};

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, currentUser } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeVideoCall, setActiveVideoCall] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [hasCachedData, setHasCachedData] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        const normalizedAppointments = data.appointments.map((appt) => ({
          ...appt,
          consultationType: appt.consultationType?.toLowerCase().includes('video') ? 'video' : 'in-person',
        }));
        setAppointments(normalizedAppointments.reverse());
        setHasCachedData(true);
      } else {
        toast.error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to cancel this appointment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
      });
      if (result.isConfirmed) {
        const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-appointment`,
          { appointmentId },
          { headers: { token } }
        );
        if (data.success) {
          toast.success(data.message);
          getUserAppointments();
          getDoctorsData();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const khaltiConfig = {
    publicKey: "84d65d807f78402fb84a03a411fd849f",
    productIdentity: "1234567890",
    productName: "Doctor appointment system",
    productUrl: "http://localhost:3000/",
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Successful", payload);
        alert("Khalti Payment successful! Appointment confirmed.");
        setProcessingPayment(false);
        getUserAppointments();
      },
      onError(error) {
        console.log("Payment Error", error);
        alert("Khalti Payment failed. Try again.");
        setProcessingPayment(false);
      },
      onClose() {
        console.log("Payment closed.");
        setProcessingPayment(false);
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

  const handleKhaltiPayment = () => {
    setProcessingPayment(true);
    khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (Rs.10)
  };

  const payWithKhalti = async (appointment) => {
    try {
      setProcessingPayment(true);
      const response = await fetch(`http://localhost:4000/khalti/complete-khalti-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: appointment._id,
          buyer_name: currentUser?.name || 'Patient',
          amount: appointment.amount || 200,
        }),
      });
      console.log('Paying with Khalti...');

      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        window.location.href = data.message;
      } else {
        throw new Error(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.log(error);
      toast.error('Khalti payment initiation failed.');
      setProcessingPayment(false);
    }
  };

  const handlePayment = (appointment) => {
    payWithKhalti(appointment); // Trigger Khalti payment with redirect to test payment website
  };

  const handleCallEnd = () => {
    setShowVideoModal(false);
    setActiveVideoCall(null);
    toast.success('Video consultation completed');
    getUserAppointments();
  };

  const canStartVideoCall = (appointment) => {
    if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) {
      return false;
    }
    try {
      const now = new Date();
      const [day, month, year] = appointment.slotDate.split('_').map(Number);
      const [time, period] = appointment.slotTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      const appointmentDate = new Date(year, month - 1, day, hours, minutes);
      const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
      const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
      return now >= startWindow && now <= endWindow;
    } catch (error) {
      return false;
    }
  };

  const confirmVideoCall = async (appointment) => {
    if (!canStartVideoCall(appointment)) {
      Swal.fire({
        title: appointment.isCompleted ? 'Appointment Completed' : 'Call Not Available',
        text: appointment.isCompleted
          ? 'This appointment has already been completed.'
          : 'The video call is not available yet.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setActiveVideoCall({
      ...appointment,
      roomName: `appointment-${appointment._id}-${Date.now()}`,
    });
    setShowVideoModal(true);
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  const categorizeAppointments = useMemo(() => {
    const now = new Date();
    return appointments.reduce(
      (acc, appointment) => {
        const [day, month, year] = appointment.slotDate.split('_').map(Number);
        const [time, period] = appointment.slotTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        const appointmentDate = new Date(year, month - 1, day, hours, minutes);
        const pastThreshold = new Date(appointmentDate.getTime() + 5 * 60000);
        if (appointment.cancelled) {
          acc.cancelled.push(appointment);
        } else if (appointment.isCompleted || now > pastThreshold) {
          acc.past.push(appointment);
        } else {
          acc.upcoming.push(appointment);
        }
        return acc;
      },
      { upcoming: [], past: [], cancelled: [] }
    );
  }, [appointments]);

  const { upcoming, past, cancelled } = categorizeAppointments;

  const renderAppointmentCard = (item, index) => (
    <div
      key={index}
      className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
        item.cancelled ? 'border-gray-300' : item.isCompleted ? 'border-green-500' : 'border-yellow-400'
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
              src={item.docData.image}
              alt={`Dr. ${item.docData.name}`}
              onError={(e) => (e.target.src = '/default-doctor.png')}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
              <p className="text-sm text-gray-600">{item.docData.speciality}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.consultationType === 'video'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.consultationType === 'video' ? (
                    <>
                      <Icons.Video />
                      Video Consultation
                    </>
                  ) : (
                    <>
                      <Icons.Location />
                      In-Person Visit
                    </>
                  )}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.cancelled
                      ? 'bg-gray-100 text-gray-800'
                      : item.isCompleted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
                </span>
                {item.paid && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
            <div className="flex items-center text-gray-700">
              <Icons.Calendar />
              <span>{slotDateFormat(item.slotDate)}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Icons.Clock />
              <span>{item.slotTime}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Icons.Payment />
              <span>NPR {item.amount || 200}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
            {!item.cancelled && !item.isCompleted && activeTab === 'upcoming' ? (
              <>
                {!item.paid && (
                  <button
                    onClick={() => handlePayment(item)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={processingPayment}
                  >
                    <Icons.Payment />
                    {processingPayment ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
                {item.consultationType === 'video' && (
                  <button
                    onClick={() => confirmVideoCall(item)}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      canStartVideoCall(item)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!canStartVideoCall(item)}
                  >
                    <Icons.Video />
                    Join Call
                  </button>
                )}
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={processingPayment}
                >
                  <Icons.Cancel />
                  Cancel
                </button>
              </>
            ) : item.cancelled ? (
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
                Appointment Cancelled
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
                Appointment Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !hasCachedData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past ({past.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cancelled ({cancelled.length})
          </button>
        </nav>
      </div>
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="mt-4 text-lg">You have no appointments at the moment.</p>
          <p className="mt-1 text-sm">When you schedule an appointment, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'upcoming' && upcoming.length > 0 && (
            <div className="space-y-4">{upcoming.map((item, index) => renderAppointmentCard(item, index))}</div>
          )}
          {activeTab === 'past' && past.length > 0 && (
            <div className="space-y-4">{past.map((item, index) => renderAppointmentCard(item, index))}</div>
          )}
          {activeTab === 'cancelled' && cancelled.length > 0 && (
            <div className="space-y-4">{cancelled.map((item, index) => renderAppointmentCard(item, index))}</div>
          )}
          {((activeTab === 'upcoming' && upcoming.length === 0) ||
            (activeTab === 'past' && past.length === 0) ||
            (activeTab === 'cancelled' && cancelled.length === 0)) && (
            <div className="text-center text-gray-500 py-12">
              <p className="mt-4 text-lg">
                {activeTab === 'upcoming'
                  ? 'No upcoming appointments'
                  : activeTab === 'past'
                  ? 'No past appointments'
                  : 'No cancelled appointments'}
              </p>
            </div>
          )}
        </div>
      )}
      {showVideoModal && activeVideoCall && (
        <VideoCall
          appointment={activeVideoCall}
          onClose={handleCallEnd}
          userInfo={{
            name: currentUser?.name || 'Patient',
            email: currentUser?.email || 'patient@example.com',
          }}
        />
      )}
    </div>
  );
};

export default MyAppointments;

// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import VideoCall from '../components/VideoCall';
// import khaltiLogo from '../assets/khalti.png';
// import KhaltiCheckout from 'khalti-checkout-web';

// const Icons = {
//   Calendar: () => (
//     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//     </svg>
//   ),
//   Clock: () => (
//     <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//     </svg>
//   ),
//   Video: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
//     </svg>
//   ),
//   Location: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//     </svg>
//   ),
//   User: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//     </svg>
//   ),
//   Cancel: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//     </svg>
//   ),
//   Payment: () => (
//     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
//     </svg>
//   ),
// };

// const MyAppointments = () => {
//   const { backendUrl, token, getDoctorsData, currentUser } = useContext(AppContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [activeVideoCall, setActiveVideoCall] = useState(null);
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [hasCachedData, setHasCachedData] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

//   const slotDateFormat = (slotDate) => {
//     const dateArray = slotDate.split('_');
//     return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
//   };

//   const getUserAppointments = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
//         headers: { token },
//       });
//       if (data.success) {
//         const normalizedAppointments = data.appointments.map((appt) => ({
//           ...appt,
//           consultationType: appt.consultationType?.toLowerCase().includes('video') ? 'video' : 'in-person',
//           paid: appt.payment || false, // Map payment to paid
//         }));
//         setAppointments(normalizedAppointments.reverse());
//         setHasCachedData(true);
//       } else {
//         toast.error(data.message || 'Failed to fetch appointments');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'Do you want to cancel this appointment?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, cancel it!',
//       });
//       if (result.isConfirmed) {
//         const { data } = await axios.post(
//           `${backendUrl}/api/user/cancel-appointment`,
//           { appointmentId },
//           { headers: { token } }
//         );
//         if (data.success) {
//           toast.success(data.message);
//           getUserAppointments();
//           getDoctorsData();
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to cancel appointment');
//     }
//   };

//   const khaltiConfig = {
//     publicKey: "84d65d807f78402fb84a03a411fd849f",
//     productIdentity: "1234567890",
//     productName: "Doctor appointment system",
//     productUrl: "http://localhost:3000/",
//     eventHandler: {
//       onSuccess(payload) {
//         console.log("Payment Successful", payload);
//         alert("Khalti Payment successful! Appointment confirmed.");
//         setProcessingPayment(false);
//         getUserAppointments();
//       },
//       onError(error) {
//         console.log("Payment Error", error);
//         alert("Khalti Payment failed. Try again.");
//         setProcessingPayment(false);
//       },
//       onClose() {
//         console.log("Payment closed.");
//         setProcessingPayment(false);
//       },
//     },
//     paymentPreference: ["KHALTI"],
//   };

//   const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

//   const handleKhaltiPayment = () => {
//     setProcessingPayment(true);
//     khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (Rs.10)
//   };

//   const payWithKhalti = async (appointment) => {
//     try {
//       setProcessingPayment(true);
//       const response = await fetch(`http://localhost:4000/khalti/complete-khalti-payment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           product_id: appointment._id,
//           buyer_name: currentUser?.name || 'Patient',
//           amount: appointment.amount || 200,
//         }),
//       });
//       console.log('Paying with Khalti...');

//       const data = await response.json();
//       console.log(data);

//       if (response.status === 200) {
//         window.location.href = data.message;
//       } else {
//         throw new Error(data.message || 'Failed to initiate payment');
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error('Khalti payment initiation failed.');
//       setProcessingPayment(false);
//     }
//   };

//   const handlePayment = (appointment) => {
//     payWithKhalti(appointment); // Trigger Khalti payment with redirect to test payment website
//   };

//   // Verify payment after Khalti redirect
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const pidx = urlParams.get('pidx');
//     if (pidx) {
//       const verifyPayment = async () => {
//         try {
//           const { data } = await axios.post(
//             `${backendUrl}/khalti/verify-payment`,
//             { pidx },
//             { headers: { token } }
//           );
//           if (data.success) {
//             toast.success('Payment verified successfully!');
//             getUserAppointments(); // Refresh appointments to show paid status
//           } else {
//             toast.error(data.message || 'Payment verification failed');
//           }
//         } catch (error) {
//           toast.error('Payment verification failed');
//         }
//       };
//       verifyPayment();
//     }
//   }, [backendUrl, token, getUserAppointments]);

//   const handleCallEnd = () => {
//     setShowVideoModal(false);
//     setActiveVideoCall(null);
//     toast.success('Video consultation completed');
//     getUserAppointments();
//   };

//   const canStartVideoCall = (appointment) => {
//     if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) {
//       return false;
//     }
//     try {
//       const now = new Date();
//       const [day, month, year] = appointment.slotDate.split('_').map(Number);
//       const [time, period] = appointment.slotTime.split(' ');
//       let [hours, minutes] = time.split(':').map(Number);
//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;
//       const appointmentDate = new Date(year, month - 1, day, hours, minutes);
//       const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
//       const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
//       return now >= startWindow && now <= endWindow;
//     } catch (error) {
//       return false;
//     }
//   };

//   const confirmVideoCall = async (appointment) => {
//     if (!canStartVideoCall(appointment)) {
//       Swal.fire({
//         title: appointment.isCompleted ? 'Appointment Completed' : 'Call Not Available',
//         text: appointment.isCompleted
//           ? 'This appointment has already been completed.'
//           : 'The video call is not available yet.',
//         icon: 'info',
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#3085d6',
//       });
//       return;
//     }

//     setActiveVideoCall({
//       ...appointment,
//       roomName: `appointment-${appointment._id}-${Date.now()}`,
//     });
//     setShowVideoModal(true);
//   };

//   useEffect(() => {
//     if (token) getUserAppointments();
//   }, [token]);

//   const categorizeAppointments = useMemo(() => {
//     const now = new Date();
//     return appointments.reduce(
//       (acc, appointment) => {
//         const [day, month, year] = appointment.slotDate.split('_').map(Number);
//         const [time, period] = appointment.slotTime.split(' ');
//         let [hours, minutes] = time.split(':').map(Number);
//         if (period === 'PM' && hours !== 12) hours += 12;
//         if (period === 'AM' && hours === 12) hours = 0;
//         const appointmentDate = new Date(year, month - 1, day, hours, minutes);
//         const pastThreshold = new Date(appointmentDate.getTime() + 5 * 60000);
//         if (appointment.cancelled) {
//           acc.cancelled.push(appointment);
//         } else if (appointment.isCompleted || now > pastThreshold) {
//           acc.past.push(appointment);
//         } else {
//           acc.upcoming.push(appointment);
//         }
//         return acc;
//       },
//       { upcoming: [], past: [], cancelled: [] }
//     );
//   }, [appointments]);

//   const { upcoming, past, cancelled } = categorizeAppointments;

//   const renderAppointmentCard = (item, index) => (
//     <div
//       key={index}
//       className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
//         item.cancelled ? 'border-gray-300' : item.isCompleted ? 'border-green-500' : 'border-yellow-400'
//       }`}
//     >
//       <div className="p-5">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-start gap-4">
//             <img
//               className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
//               src={item.docData.image}
//               alt={`Dr. ${item.docData.name}`}
//               onError={(e) => (e.target.src = '/default-doctor.png')}
//             />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800">{item.docData.name}</h3>
//               <p className="text-sm text-gray-600">{item.docData.speciality}</p>
//               <div className="flex items-center mt-2 space-x-2">
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     item.consultationType === 'video'
//                       ? 'bg-blue-100 text-blue-800'
//                       : 'bg-purple-100 text-purple-800'
//                   }`}
//                 >
//                   {item.consultationType === 'video' ? (
//                     <>
//                       <Icons.Video />
//                       Video Consultation
//                     </>
//                   ) : (
//                     <>
//                       <Icons.Location />
//                       In-Person Visit
//                     </>
//                   )}
//                 </span>
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     item.cancelled
//                       ? 'bg-gray-100 text-gray-800'
//                       : item.isCompleted
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}
//                 >
//                   {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Scheduled'}
//                 </span>
//                 {item.paid && (
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     Paid
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
//             <div className="flex items-center text-gray-700">
//               <Icons.Calendar />
//               <span>{slotDateFormat(item.slotDate)}</span>
//             </div>
//             <div className="flex items-center text-gray-700">
//               <Icons.Clock />
//               <span>{item.slotTime}</span>
//             </div>
//             <div className="flex items-center text-gray-700">
//               <Icons.Payment />
//               <span>NPR {item.amount || 200}</span>
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
//             {!item.cancelled && !item.isCompleted && activeTab === 'upcoming' ? (
//               <>
//                 {!item.paid && (
//                   <button
//                     onClick={() => handlePayment(item)}
//                     className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     disabled={processingPayment}
//                   >
//                     <Icons.Payment />
//                     {processingPayment ? 'Processing...' : 'Pay Now'}
//                   </button>
//                 )}
//                 {item.consultationType === 'video' && (
//                   <button
//                     onClick={() => confirmVideoCall(item)}
//                     className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
//                       canStartVideoCall(item)
//                         ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                     }`}
//                     disabled={!canStartVideoCall(item)}
//                   >
//                     <Icons.Video />
//                     Join Call
//                   </button>
//                 )}
//                 <button
//                   onClick={() => cancelAppointment(item._id)}
//                   className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   disabled={processingPayment}
//                 >
//                   <Icons.Cancel />
//                   Cancel
//                 </button>
//               </>
//             ) : item.cancelled ? (
//               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
//                 Appointment Cancelled
//               </span>
//             ) : (
//               <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-gray-50">
//                 Appointment Completed
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading && !hasCachedData) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setActiveTab('upcoming')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'upcoming'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Upcoming ({upcoming.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('past')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'past'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Past ({past.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('cancelled')}
//             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'cancelled'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Cancelled ({cancelled.length})
//           </button>
//         </nav>
//       </div>
//       {appointments.length === 0 ? (
//         <div className="text-center text-gray-500 py-12">
//           <p className="mt-4 text-lg">You have no appointments at the moment.</p>
//           <p className="mt-1 text-sm">When you schedule an appointment, it will appear here.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {activeTab === 'upcoming' && upcoming.length > 0 && (
//             <div className="space-y-4">{upcoming.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}
//           {activeTab === 'past' && past.length > 0 && (
//             <div className="space-y-4">{past.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}
//           {activeTab === 'cancelled' && cancelled.length > 0 && (
//             <div className="space-y-4">{cancelled.map((item, index) => renderAppointmentCard(item, index))}</div>
//           )}
//           {((activeTab === 'upcoming' && upcoming.length === 0) ||
//             (activeTab === 'past' && past.length === 0) ||
//             (activeTab === 'cancelled' && cancelled.length === 0)) && (
//             <div className="text-center text-gray-500 py-12">
//               <p className="mt-4 text-lg">
//                 {activeTab === 'upcoming'
//                   ? 'No upcoming appointments'
//                   : activeTab === 'past'
//                   ? 'No past appointments'
//                   : 'No cancelled appointments'}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//       {showVideoModal && activeVideoCall && (
//         <VideoCall
//           appointment={activeVideoCall}
//           onClose={handleCallEnd}
//           userInfo={{
//             name: currentUser?.name || 'Patient',
//             email: currentUser?.email || 'patient@example.com',
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default MyAppointments;


// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { 
//   FaVideo, 
//   FaUser, 
//   FaCalendarAlt, 
//   FaClock, 
//   FaTimes, 
//   FaCheck,
//   FaSpinner,
//   FaPhoneSlash
// } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Menu, Transition } from '@headlessui/react';
// import VideoCall from '../components/VideoCall';
// import { format, parse, isWithinInterval, addMinutes, subMinutes } from 'date-fns';

// const MyAppointments = () => {
//   const { 
//     backendUrl, 
//     token, 
//     currentUser,
//     cancelAppointment,
//     getAppointments
//   } = useContext(AppContext);
  
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('upcoming');
//   const [activeVideoCall, setActiveVideoCall] = useState(null);
//   const [callStarting, setCallStarting] = useState(false);

//   // Format appointment date
//   const formatAppointmentDate = (dateStr) => {
//     const [day, month, year] = dateStr.split('_').map(Number);
//     return format(new Date(year, month - 1, day), 'MMMM do, yyyy');
//   };

//   // Check if current time is within call window
//   const canStartVideoCall = (appointment) => {
//     if (!appointment.slotDate || !appointment.slotTime || appointment.status === 'completed') {
//       return false;
//     }

//     try {
//       const now = new Date();
//       const [day, month, year] = appointment.slotDate.split('_').map(Number);
//       const [time, period] = appointment.slotTime.split(' ');
//       let [hours, minutes] = time.split(':').map(Number);

//       // Convert to 24-hour format
//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;

//       const appointmentTime = new Date(year, month - 1, day, hours, minutes);
//       const startWindow = subMinutes(appointmentTime, 15);
//       const endWindow = addMinutes(appointmentTime, 30);

//       return isWithinInterval(now, { start: startWindow, end: endWindow });
//     } catch (error) {
//       console.error('Error checking call window:', error);
//       return false;
//     }
//   };

//   // Get human-readable call window message
//   const getCallWindowMessage = (appointment) => {
//     try {
//       const [day, month, year] = appointment.slotDate.split('_').map(Number);
//       const [time, period] = appointment.slotTime.split(' ');
//       let [hours, minutes] = time.split(':').map(Number);

//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;

//       const appointmentTime = new Date(year, month - 1, day, hours, minutes);
//       const startWindow = subMinutes(appointmentTime, 15);
//       const endWindow = addMinutes(appointmentTime, 30);

//       return `Available from ${format(startWindow, 'h:mm a')} to ${format(endWindow, 'h:mm a')}`;
//     } catch (error) {
//       return 'Unable to determine call window';
//     }
//   };

//   const confirmVideoCall = async (appointment) => {
//     if (!canStartVideoCall(appointment)) {
//       Swal.fire({
//         title: 'Call Not Available',
//         text: `The video call is not available yet. ${getCallWindowMessage(appointment)}`,
//         icon: 'info',
//       });
//       return;
//     }

//     setCallStarting(true);
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/appointments/${appointment._id}/call-details`,
//         { headers: { token } }
//       );
      
//       if (data.success) {
//         setActiveVideoCall({
//           ...appointment,
//           roomName: data.roomName,
//           password: data.password,
//           doctor: data.doctor
//         });
//       } else {
//         toast.error(data.message || 'Failed to get call details');
//       }
//     } catch (error) {
//       console.error('Error starting call:', error);
//       toast.error(error.response?.data?.message || 'Failed to start video call');
//     } finally {
//       setCallStarting(false);
//     }
//   };

//   const handleCallEnd = () => {
//     setActiveVideoCall(null);
//     getAppointments(); // Refresh appointments after call ends
//   };

//   const confirmCancelAppointment = async (appointmentId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You won\'t be able to revert this!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, cancel it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         await cancelAppointment(appointmentId);
//         toast.success('Appointment cancelled successfully');
//       } catch (error) {
//         toast.error('Failed to cancel appointment');
//       }
//     }
//   };

//   const filteredAppointments = useMemo(() => {
//     return appointments.filter(appt => {
//       if (appt.consultationType !== 'video') return false;
      
//       switch (activeTab) {
//         case 'upcoming':
//           return !['completed', 'cancelled'].includes(appt.status);
//         case 'completed':
//           return appt.status === 'completed';
//         case 'cancelled':
//           return appt.status === 'cancelled';
//         default:
//           return true;
//       }
//     });
//   }, [appointments, activeTab]);

//   useEffect(() => {
//     if (token) {
//       getAppointments().finally(() => setLoading(false));
//     }
//   }, [token, getAppointments]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
//       {/* Filter Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           onClick={() => setActiveTab('upcoming')}
//           className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Upcoming ({filteredAppointments.filter(a => !['completed', 'cancelled'].includes(a.status)).length})
//         </button>
//         <button
//           onClick={() => setActiveTab('completed')}
//           className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Completed ({filteredAppointments.filter(a => a.status === 'completed').length})
//         </button>
//         <button
//           onClick={() => setActiveTab('cancelled')}
//           className={`px-4 py-2 font-medium ${activeTab === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Cancelled ({filteredAppointments.filter(a => a.status === 'cancelled').length})
//         </button>
//       </div>

//       {/* Appointments List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <FaVideo className="mx-auto text-4xl text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-700">
//             {activeTab === 'upcoming' 
//               ? 'No upcoming video appointments' 
//               : activeTab === 'completed' 
//                 ? 'No completed appointments' 
//                 : 'No cancelled appointments'}
//           </h3>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <div key={appointment._id} className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-blue-500">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   {/* Doctor Info */}
//                   <div className="flex items-center gap-4">
//                     <div className="bg-blue-100 rounded-full p-3">
//                       <FaUser className="text-blue-600 text-xl" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg">{appointment.doctor?.name || 'Doctor'}</h3>
//                       <p className="text-gray-600">{appointment.doctor?.speciality || 'General Practitioner'}</p>
//                       <div className="mt-2 flex gap-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           appointment.status === 'completed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : appointment.status === 'cancelled'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {appointment.status}
//                         </span>
//                         {canStartVideoCall(appointment) && (
//                           <span className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//                             <FaClock className="mr-1" /> Available Now
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Appointment Time */}
//                   <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
//                     <FaCalendarAlt className="text-gray-500 mr-2" />
//                     <div>
//                       <p className="font-medium">{formatAppointmentDate(appointment.slotDate)}</p>
//                       <p className="text-gray-600">{appointment.slotTime}</p>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex items-center gap-2">
//                     {appointment.status === 'scheduled' && (
//                       <button
//                         onClick={() => confirmVideoCall(appointment)}
//                         disabled={!canStartVideoCall(appointment) || callStarting}
//                         className={`flex items-center px-4 py-2 rounded-md text-white ${
//                           canStartVideoCall(appointment) 
//                             ? 'bg-blue-600 hover:bg-blue-700' 
//                             : 'bg-gray-300 cursor-not-allowed'
//                         }`}
//                       >
//                         <FaVideo className="mr-2" />
//                         {callStarting && appointment._id === activeVideoCall?._id ? (
//                           <FaSpinner className="animate-spin mr-2" />
//                         ) : 'Join Call'}
//                       </button>
//                     )}

//                     <Menu as="div" className="relative">
//                       <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
//                         <BsThreeDotsVertical />
//                       </Menu.Button>
//                       <Transition
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
//                           <div className="py-1">
//                             {appointment.status === 'scheduled' && (
//                               <Menu.Item>
//                                 {({ active }) => (
//                                   <button
//                                     onClick={() => confirmCancelAppointment(appointment._id)}
//                                     className={`${
//                                       active ? 'bg-gray-100' : ''
//                                     } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left`}
//                                   >
//                                     <FaTimes className="mr-2 text-red-500" />
//                                     Cancel Appointment
//                                   </button>
//                                 )}
//                               </Menu.Item>
//                             )}
//                             <Menu.Item>
//                               {({ active }) => (
//                                 <button
//                                   className={`${
//                                     active ? 'bg-gray-100' : ''
//                                   } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left`}
//                                 >
//                                   View Details
//                                 </button>
//                               )}
//                             </Menu.Item>
//                           </div>
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Video Call Modal */}
//       {activeVideoCall && (
//         <VideoCall
//           appointment={activeVideoCall}
//           onClose={handleCallEnd}
//           userInfo={{
//             name: currentUser?.name || 'Patient',
//             email: currentUser?.email || '',
//             isDoctor: false
//           }}
//         />
//       )}

//       {/* Loading Overlay */}
//       {callStarting && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
//             <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium mb-2">Preparing Video Consultation</h3>
//             <p className="text-gray-600">Connecting with Dr. {activeVideoCall?.doctor?.name || 'doctor'}...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAppointments;