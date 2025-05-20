import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaVideo, FaClinicMedical, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { BsCalendarDay, BsClock } from 'react-icons/bs';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const navigate = useNavigate();
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [consultationType, setConsultationType] = useState('Video Consultation');

    const fetchDocInfo = async () => {
        const docInfo = doctors?.find(doc => doc._id === docId);
        if (!docInfo) {
            toast.error('Doctor not found');
            navigate('/doctors');
            return;
        }
        setDocInfo(docInfo);
    };

    const getAvailableSlots = async () => {
        setDocSlots([]);
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date(currentDate);
            endTime.setHours(19, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 0 ? 0 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];
            while (currentDate < endTime) {
                const currentHour = currentDate.getHours();
                if (currentHour === 14) {
                    currentDate.setHours(15);
                    currentDate.setMinutes(0);
                    continue;
                }

                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();

                const slotDate = day + '_' + month + '_' + year;
                const slotTime = formattedTime;

                const isSlotAvailable =
                    docInfo.slots_booked && docInfo.slots_booked[slotDate]
                        ? !docInfo.slots_booked[slotDate].includes(slotTime)
                        : true;

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
            setDocSlots(prev => [...prev, timeSlots]);
        }
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Please login to book an appointment');
            return navigate('/login');
        }

        if (!slotTime) {
            toast.warn('Please select a time slot');
            return;
        }

        try {
            const date = docSlots[slotIndex][0].datetime;
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
            
            console.log('Booking appointment with details:', { docId, slotDate, slotTime, consultationType });
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime, consultationType },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointment');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Booking error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    const formatDateHeader = (date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return daysOfWeek[date.getDay()];
        }
    };

    return docInfo ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Doctor Profile Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="md:w-1/3 lg:w-1/4">
                    <img
                        className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md"
                        src={docInfo.image}
                        alt={docInfo.name}
                    />
                </div>

                <div className="md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                {docInfo.name}
                                <FaCheckCircle className="text-blue-500" />
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-gray-600">
                                    {docInfo.degree} - {docInfo.speciality}
                                </p>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {docInfo.experience} years exp
                                </span>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                            <p className="font-bold">
                                {currencySymbol}
                                {docInfo.fees}
                                <span className="text-sm font-normal ml-1">consultation fee</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <HiOutlineInformationCircle className="text-gray-600" />
                            About
                        </h3>
                        <p className="text-gray-600 mt-2 leading-relaxed">{docInfo.about}</p>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Booking Form */}
                <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6 mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

                    {/* Date Selector */}
                    <div className="mb-8">
                        <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <BsCalendarDay />
                            Select Date
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                            {docSlots.length > 0 &&
                                docSlots.map((slots, index) => {
                                    const date = slots[0]?.datetime || new Date();
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSlotIndex(index)}
                                            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                                                slotIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                            aria-pressed={slotIndex === index}
                                        >
                                            <span className="text-sm font-medium">{formatDateHeader(date)}</span>
                                            <span className="text-lg font-bold mt-1">{date.getDate()}</span>
                                            <span className="text-xs">{months[date.getMonth()]}</span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <BsClock />
                            Select Time
                        </h3>
                        {docSlots[slotIndex]?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {docSlots[slotIndex].map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSlotTime(slot.time)}
                                        className={`py-3 px-4 rounded-lg border transition-all ${
                                            slot.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'
                                        }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 py-4">No available slots for this day</p>
                        )}
                    </div>

                    {/* Consultation Type Selector */}
                    <div className="mt-8 mb-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Consultation Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setConsultationType('Video Consultation')}
                                className={`p-4 rounded-lg border transition-all ${
                                    consultationType === 'Video Consultation' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-2 rounded-full ${
                                            consultationType === 'Video Consultation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        <FaVideo className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Video Consultation</h4>
                                        <p className="text-sm text-gray-600 mt-1">Consult with doctor via video call</p>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => setConsultationType('In-person Visit')}
                                className={`p-4 rounded-lg border transition-all ${
                                    consultationType === 'In-person Visit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-2 rounded-full ${
                                            consultationType === 'In-person Visit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        <FaClinicMedical className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">In-person Visit</h4>
                                        <p className="text-sm text-gray-600 mt-1">Visit the doctor at their clinic</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Booking Summary */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doctor:</span>
                            <span className="font-medium">Dr. {docInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                                {docSlots[slotIndex]?.length > 0
                                    ? `${daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, ${
                                        months[docSlots[slotIndex][0].datetime.getMonth()]
                                    } ${docSlots[slotIndex][0].datetime.getDate()}, ${docSlots[slotIndex][0].datetime.getFullYear()}`
                                    : 'Not selected'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{slotTime || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{consultationType}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-800 font-medium">Total Amount:</span>
                                <span className="font-bold text-blue-600">
                                    {currencySymbol}
                                    {docInfo.fees}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={bookAppointment}
                            disabled={!slotTime}
                            className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
                                slotTime ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Confirm Booking
                        </button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                        <p>
                            By booking this appointment, you agree to our{' '}
                            <a className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                            <a className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    ) : (
        <div className="text-center py-8">Loading...</div>
    );
};

export default Appointment;


// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import RelatedDoctors from '../components/RelatedDoctors';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import KhaltiCheckout from 'khalti-checkout-web';
// import { FaVideo, FaClinicMedical, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
// import { HiOutlineInformationCircle } from 'react-icons/hi';
// import { MdPayment } from 'react-icons/md';
// import { BsCalendarDay, BsClock } from 'react-icons/bs';

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userProfile } = useContext(AppContext);
//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const navigate = useNavigate();
//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState('');
//   const [consultationType, setConsultationType] = useState('Video Consultation');
//   const [paymentMethod, setPaymentMethod] = useState('Khalti');
//   const [selectedPaymentId, setSelectedPaymentId] = useState(null);
//   const [isPaying, setIsPaying] = useState(false);

//   const fetchDocInfo = async () => {
//     const docInfo = doctors?.find(doc => doc._id === docId);
//     if (!docInfo) {
//       toast.error('Doctor not found');
//       navigate('/doctors');
//       return;
//     }
//     setDocInfo(docInfo);
//   };

//   const getAvailableSlots = async () => {
//     setDocslots([]);
//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date(currentDate);
//       endTime.setHours(23, 50, 0, 0);

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setMinutes(currentDate.getMinutes() > 0 ? Math.ceil(currentDate.getMinutes() / 10) * 10 : 0);
//       } else {
//         currentDate.setHours(0);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];
//       while (currentDate < endTime) {
//         let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//         let day = currentDate.getDate();
//         let month = currentDate.getMonth() + 1;
//         let year = currentDate.getFullYear();

//         const slotDate = day + '_' + month + '_' + year;
//         const slotTime = formattedTime;

//         const isSlotAvailable =
//           docInfo.slots_booked && docInfo.slots_booked[slotDate]
//             ? !docInfo.slots_booked[slotDate].includes(slotTime)
//             : true;

//         if (isSlotAvailable) {
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime,
//           });
//         }

//         currentDate.setMinutes(currentDate.getMinutes() + 10);
//       }
//       setDocslots(prev => [...prev, timeSlots]);
//     }
//   };

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn('Please login to book an appointment');
//       return navigate('/login');
//     }

//     if (!slotTime) {
//       toast.warn('Please select a time slot');
//       return;
//     }

//     if (isPaying) {
//       toast.warn('Payment in progress, please wait');
//       return;
//     }

//     try {
//       const date = docSlots[slotIndex][0].datetime;
//       const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

//       if (paymentMethod === 'Khalti') {
//         setIsPaying(true);
//         handlePayment(slotDate, paymentMethod);
//       } else {
//         await bookAppointmentRequest(slotDate);
//       }
//     } catch (error) {
//       setIsPaying(false);
//       toast.error(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   const bookAppointmentRequest = async (slotDate) => {
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/user/book-appointment`,
//         { docId, slotDate, slotTime, consultationType, paymentMethod },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getDoctorsData();
//         navigate('/my-appointment');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Booking failed');
//     }
//   };

//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   const formatDateHeader = (date) => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) {
//       return 'Today';
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return 'Tomorrow';
//     } else {
//       return daysOfWeek[date.getDay()];
//     }
//   };

//   // Khalti Configuration
//   const khaltiConfig = {
//     publicKey: 'fadd4ece35de41ab9193f19d980329d4',
//     productIdentity: 'test123',
//     productName: 'Doctor Appointment',
//     productUrl: 'http://localhost:3000',
//     eventHandler: {
//       onSuccess(payload) {
//         console.log('Payment Successful:', payload);
//         toast.success('Khalti Payment successful! Verifying payment...');
//         setSelectedPaymentId(null);
//         payWithKhalti(payload);
//       },
//       onError(error) {
//         console.error('Khalti Payment Error:', {
//           message: error.message,
//           status_code: error.status_code,
//           details: error,
//         });
//         setIsPaying(false);
//         if (error.status_code === 400) {
//           toast.error('Invalid payment request. Check your Khalti public key or product configuration in the Khalti dashboard.');
//         } else if (error.message?.includes('public_key')) {
//           toast.error('Invalid Khalti public key. Please verify your key in the Khalti dashboard.');
//         } else {
//           toast.error(`Khalti Payment failed: ${error.message || 'Unknown error'}`);
//         }
//       },
//       onClose() {
//         console.log('Payment modal closed.');
//         setIsPaying(false);
//         toast.info('Payment cancelled');
//       },
//     },
//     paymentPreference: ['KHALTI'],
//   };

//   const khaltiCheckout = new KhaltiCheckout(khaltiConfig);
//   console.log('KhaltiCheckout initialized with publicKey:', khaltiConfig.publicKey);

//   const handleKhaltiPayment = () => {
//     if (!docInfo?.fees) {
//       toast.error('Doctor fees not available');
//       setIsPaying(false);
//       return;
//     }
//     const amount = docInfo.fees * 100; // Convert rupees to paisa
//     console.log('handleKhaltiPayment - docInfo.fees:', docInfo.fees, 'amount:', amount);
//     if (amount < 1000) {
//       toast.error('Payment amount must be at least NPR 10');
//       setIsPaying(false);
//       return;
//     }
//     console.log('Initiating Khalti payment:', { amount, publicKey: khaltiConfig.publicKey });
//     khaltiCheckout.show({ amount });
//   };

//   const handlePayment = (appointmentId, method) => {
//     if (method === 'Khalti') {
//       handleKhaltiPayment();
//     }
//     setSelectedPaymentId(null);
//   };

//   const payWithKhalti = async (payload) => {
//     try {
//       console.log('Verifying Khalti payment with payload:', payload);
//       const response = await fetch(`${backendUrl}/khalti/complete-khalti-payment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token: payload.token,
//           amount: payload.amount,
//           product_id: '12345678',
//           product_identity: khaltiConfig.productIdentity,
//           buyer_name: userProfile?.name || 'Guest',
//         }),
//       });

//       const data = await response.json();
//       console.log('Khalti payment verification response:', data);

//       if (response.status === 200 && data.success) {
//         const date = docSlots[slotIndex][0].datetime;
//         const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
//         await bookAppointmentRequest(slotDate);
//       } else {
//         toast.error('Payment verification failed: ' + (data.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error verifying Khalti payment:', error);
//       toast.error('Payment verification failed: ' + (error.message || 'Network error'));
//     } finally {
//       setIsPaying(false);
//     }
//   };

//   return docInfo ? (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Doctor Profile Section */}
//       <div className="flex flex-col md:flex-row gap-8 mb-12">
//         <div className="md:w-1/3 lg:w-1/4">
//           <img
//             className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md"
//             src={docInfo.image}
//             alt={docInfo.name}
//           />
//         </div>

//         <div className="md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-md p-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//                 {docInfo.name}
//                 <FaCheckCircle className="text-blue-500" />
//               </h1>
//               <div className="flex items-center gap-3 mt-2">
//                 <p className="text-gray-600">
//                   {docInfo.degree} - {docInfo.speciality}
//                 </p>
//                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                   {docInfo.experience} years exp
//                 </span>
//               </div>
//             </div>
//             <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
//               <p className="font-bold">
//                 {currencySymbol}
//                 {docInfo.fees}
//                 <span className="text-sm font-normal ml-1">consultation fee</span>
//               </p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <HiOutlineInformationCircle className="text-gray-600" />
//               About
//             </h3>
//             <p className="text-gray-600 mt-2 leading-relaxed">{docInfo.about}</p>
//           </div>
//         </div>
//       </div>

//       {/* Booking Section */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Left Side - Booking Form */}
//         <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6 mb-12">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

//           {/* Date Selector */}
//           <div className="mb-8">
//             <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <BsCalendarDay />
//               Select Date
//             </h3>
//             <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
//               {docSlots.length > 0 &&
//                 docSlots.map((slots, index) => {
//                   const date = slots[0]?.datetime || new Date();
//                   return (
//                     <button
//                       key={index}
//                       onClick={() => setSlotIndex(index)}
//                       className={`flex flex-col items-center p-3 rounded-lg transition-all ${
//                         slotIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'
//                       }`}
//                       aria-pressed={slotIndex === index}
//                     >
//                       <span className="text-sm font-medium">{formatDateHeader(date)}</span>
//                       <span className="text-lg font-bold mt-1">{date.getDate()}</span>
//                       <span className="text-xs">{months[date.getMonth()]}</span>
//                     </button>
//                   );
//                 })}
//             </div>
//           </div>

//           {/* Time Slot Selector */}
//           <div>
//             <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <BsClock />
//               Select Time
//             </h3>
//             {docSlots[slotIndex]?.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                 {docSlots[slotIndex].map((slot, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSlotTime(slot.time)}
//                     className={`py-3 px-4 rounded-lg border transition-all ${
//                       slot.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'
//                     }`}
//                   >
//                     {slot.time}
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 py-4">No available slots for this day</p>
//             )}
//           </div>

//           {/* Consultation Type Selector */}
//           <div className="mt-8 mb-6">
//             <h3 className="text-md font-semibold text-gray-700 mb-4">Consultation Type</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <button
//                 onClick={() => setConsultationType('Video Consultation')}
//                 className={`p-4 rounded-lg border transition-all ${
//                   consultationType === 'Video Consultation' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                 }`}
//               >
//                 <div className="flex items-start gap-3">
//                   <div
//                     className={`p-2 rounded-full ${
//                       consultationType === 'Video Consultation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
//                     }`}
//                   >
//                     <FaVideo className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">Video Consultation</h4>
//                     <p className="text-sm text-gray-600 mt-1">Consult with doctor via video call</p>
//                   </div>
//                 </div>
//               </button>
//               <button
//                 onClick={() => setConsultationType('In-person Visit')}
//                 className={`p-4 rounded-lg border transition-all ${
//                   consultationType === 'In-person Visit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                 }`}
//               >
//                 <div className="flex items-start gap-3">
//                   <div
//                     className={`p-2 rounded-full ${
//                       consultationType === 'In-person Visit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
//                     }`}
//                   >
//                     <FaClinicMedical className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">In-person Visit</h4>
//                     <p className="text-sm text-gray-600 mt-1">Visit the doctor at their clinic</p>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Payment Method Selector */}
//           <div className="mt-8 mb-6">
//             <h3 className="text-md font-semibold text-gray-700 mb-4">Payment Method</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <button
//                 onClick={() => setPaymentMethod('Khalti')}
//                 className={`p-4 rounded-lg border transition-all ${
//                   paymentMethod === 'Khalti' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <MdPayment className="w-6 h-6 text-purple-600" />
//                   <span className="font-medium text-gray-800">Pay Online (Khalti)</span>
//                 </div>
//               </button>
//               <button
//                 onClick={() => setPaymentMethod('Cash')}
//                 className={`p-4 rounded-lg border transition-all ${
//                   paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <FaMoneyBillWave className="w-6 h-6 text-green-600" />
//                   <span className="font-medium text-gray-800">Pay at Clinic (Cash)</span>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Booking Summary */}
//         <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h2>

//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Doctor:</span>
//               <span className="font-medium">Dr. {docInfo.name}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Date:</span>
//               <span className="font-medium">
//                 {docSlots[slotIndex]?.length > 0
//                   ? `${daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, ${
//                       months[docSlots[slotIndex][0].datetime.getMonth()]
//                     } ${docSlots[slotIndex][0].datetime.getDate()}, ${docSlots[slotIndex][0].datetime.getFullYear()}`
//                   : 'Not selected'}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Time:</span>
//               <span className="font-medium">{slotTime || 'Not selected'}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Type:</span>
//               <span className="font-medium">{consultationType}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Payment:</span>
//               <span className="font-medium">{paymentMethod}</span>
//             </div>

//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-800 font-medium">Total Amount:</span>
//                 <span className="font-bold text-blue-600">
//                   {currencySymbol}
//                   {docInfo.fees}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8">
//             <button
//               onClick={bookAppointment}
//               disabled={!slotTime || isPaying}
//               className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
//                 slotTime && !isPaying ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
//               }`}
//             >
//               {isPaying ? 'Processing Payment...' : 'Confirm Booking'}
//             </button>
//           </div>

//           <div className="mt-4 text-xs text-gray-500 text-center">
//             <p>
//               By booking this appointment, you agree to our{' '}
//               <a className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
//               <a className="text-blue-600 hover:underline">Privacy Policy</a>.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Related Doctors */}
//       <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//     </div>
//   ) : (
//     <div className="text-center py-8">Loading...</div>
//   );
// };

// export default Appointment;



// final one

// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import RelatedDoctors from '../components/RelatedDoctors';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { FaVideo, FaClinicMedical, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
// import { HiOutlineInformationCircle } from 'react-icons/hi';
// import { MdPayment } from 'react-icons/md';
// import { BsCalendarDay, BsClock } from 'react-icons/bs';

// const Appointment = () => {
//     const { docId } = useParams();
//     const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userProfile } = useContext(AppContext);
//     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//     const navigate = useNavigate();
//     const [docInfo, setDocInfo] = useState(null);
//     const [docSlots, setDocSlots] = useState([]);
//     const [slotIndex, setSlotIndex] = useState(0);
//     const [slotTime, setSlotTime] = useState('');
//     const [consultationType, setConsultationType] = useState('Video Consultation');
//     const [paymentMethod, setPaymentMethod] = useState('Khalti'); // UI state for payment method
//     const [isPaying, setIsPaying] = useState(false);

//     // Persist slot details in localStorage
//     const persistSlotDetails = (slotDate, slotTime, consultationType, payment) => {
//         localStorage.setItem('appointmentDetails', JSON.stringify({
//             slotDate,
//             slotTime,
//             consultationType,
//             payment, // true for Khalti, false for Cash
//             docId
//         }));
//     };

//     const getPersistedSlotDetails = () => {
//         const details = localStorage.getItem('appointmentDetails');
//         return details ? JSON.parse(details) : null;
//     };

//     const clearPersistedSlotDetails = () => {
//         localStorage.removeItem('appointmentDetails');
//     };

//     const fetchDocInfo = async () => {
//         const docInfo = doctors?.find(doc => doc._id === docId);
//         if (!docInfo) {
//             toast.error('Doctor not found');
//             navigate('/doctors');
//             return;
//         }
//         setDocInfo(docInfo);
//     };

//     const getAvailableSlots = async () => {
//         setDocSlots([]);
//         let today = new Date();

//         for (let i = 0; i < 7; i++) {
//             let currentDate = new Date(today);
//             currentDate.setDate(today.getDate() + i);

//             let endTime = new Date(currentDate);
//             endTime.setHours(19, 0, 0, 0);

//             if (today.getDate() === currentDate.getDate()) {
//                 currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//                 currentDate.setMinutes(currentDate.getMinutes() > 0 ? 0 : 0);
//             } else {
//                 currentDate.setHours(10);
//                 currentDate.setMinutes(0);
//             }

//             let timeSlots = [];
//             while (currentDate < endTime) {
//                 const currentHour = currentDate.getHours();
//                 if (currentHour === 14) {
//                     currentDate.setHours(15);
//                     currentDate.setMinutes(0);
//                     continue;
//                 }

//                 let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//                 let day = currentDate.getDate();
//                 let month = currentDate.getMonth() + 1;
//                 let year = currentDate.getFullYear();

//                 const slotDate = day + '_' + month + '_' + year;
//                 const slotTime = formattedTime;

//                 const isSlotAvailable =
//                     docInfo.slots_booked && docInfo.slots_booked[slotDate]
//                         ? !docInfo.slots_booked[slotDate].includes(slotTime)
//                         : true;

//                 if (isSlotAvailable) {
//                     timeSlots.push({
//                         datetime: new Date(currentDate),
//                         time: formattedTime,
//                     });
//                 }

//                 currentDate.setMinutes(currentDate.getMinutes() + 30);
//             }
//             setDocSlots(prev => [...prev, timeSlots]);
//         }
//     };

//     const bookAppointment = async () => {
//         if (!token) {
//             toast.warn('Please login to book an appointment');
//             return navigate('/login');
//         }

//         if (!slotTime) {
//             toast.warn('Please select a time slot');
//             return;
//         }

//         if (isPaying) {
//             toast.warn('Payment in progress, please wait');
//             return;
//         }

//         try {
//             const date = docSlots[slotIndex][0].datetime;
//             const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
//             const payment = paymentMethod === 'Khalti'; // true for Khalti, false for Cash

//             // Persist slot details before initiating payment
//             persistSlotDetails(slotDate, slotTime, consultationType, payment);

//             if (paymentMethod === 'Khalti') {
//                 setIsPaying(true);
//                 await initiateKhaltiPayment(slotDate);
//             } else {
//                 await bookAppointmentRequest(slotDate, slotTime, consultationType, payment);
//             }
//         } catch (error) {
//             setIsPaying(false);
//             toast.error(error.response?.data?.message || 'An error occurred during booking');
//             console.error('Book appointment error:', error);
//         }
//     };

//     const bookAppointmentRequest = async (slotDate, slotTime, consultationType, payment) => {
//         try {
//             console.log('Booking appointment with details:', { docId, slotDate, slotTime, consultationType, payment });
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
//             }
//         } catch (error) {
//             console.error('Booking error:', error.response?.data);
//             toast.error(error.response?.data?.message || 'Booking failed');
//         }
//     };

//     const initiateKhaltiPayment = async (slotDate) => {
//         if (!docInfo?.fees) {
//             toast.error('Doctor fees not available');
//             setIsPaying(false);
//             return;
//         }

//         const amount = docInfo.fees; // Amount in NPR
//         if (amount < 10) {
//             toast.error('Payment amount must be at least NPR 10');
//             setIsPaying(false);
//             return;
//         }

//         try {
//             console.log('Initiating Khalti payment:', { amount, slotDate, doctor: docInfo.name });
//             const response = await fetch(`${backendUrl}/khalti/complete-khalti-payment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     product_id: `appointment_${docId}_${slotDate}`,
//                     buyer_name: userProfile?.name || 'Guest',
//                     amount: amount // Send amount in NPR
//                 }),
//             });

//             const data = await response.json();
//             console.log('Khalti payment initiation response:', data);

//             if (response.status === 200 && data.success) {
//                 window.location.href = data.message; // Redirect to Khalti payment page
//             } else {
//                 toast.error(data.message || 'Failed to initiate payment');
//                 setIsPaying(false);
//             }
//         } catch (error) {
//             console.error('Error initiating Khalti payment:', error);
//             toast.error('Payment initiation failed: ' + (error.message || 'Network error'));
//             setIsPaying(false);
//         }
//     };

//     // Handle Khalti redirect callback
//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const pidx = urlParams.get('pidx');
//         const amount = urlParams.get('amount');
//         const status = urlParams.get('status');

//         if (pidx && amount && status === 'Completed') {
//             const persistedDetails = getPersistedSlotDetails();
//             if (persistedDetails && persistedDetails.docId === docId) {
//                 console.log('Processing Khalti callback with persisted details:', persistedDetails);
//                 verifyKhaltiPayment(pidx, Number(amount), persistedDetails);
//             } else {
//                 toast.error('Invalid or missing appointment details');
//                 setIsPaying(false);
//                 clearPersistedSlotDetails();
//             }
//         } else if (pidx && status === 'Failed') {
//             toast.error('Payment failed');
//             setIsPaying(false);
//             clearPersistedSlotDetails();
//         }
//     }, [docId]);

//     const verifyKhaltiPayment = async (pidx, amount, persistedDetails) => {
//         try {
//             const { slotDate, slotTime, consultationType, payment } = persistedDetails;
//             console.log('Verifying Khalti payment:', { pidx, amount, slotDate });
//             const response = await fetch(`${backendUrl}/khalti/verify-khalti-payment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     pidx,
//                     amount, // Amount in paisa
//                     product_id: `appointment_${docId}_${slotDate}`,
//                 }),
//             });

//             const data = await response.json();
//             console.log('Khalti payment verification response:', data);

//             if (response.status === 200 && data.success) {
//                 if (slotDate && slotTime) {
//                     await bookAppointmentRequest(slotDate, slotTime, consultationType, payment);
//                 } else {
//                     toast.error('Invalid slot details for booking');
//                     setIsPaying(false);
//                     clearPersistedSlotDetails();
//                 }
//             } else {
//                 toast.error('Payment verification failed: ' + (data.message || 'Unknown error'));
//                 setIsPaying(false);
//                 clearPersistedSlotDetails();
//             }
//         } catch (error) {
//             console.error('Error verifying Khalti payment:', error);
//             toast.error('Payment verification failed: ' + (error.message || 'Network error'));
//             setIsPaying(false);
//             clearPersistedSlotDetails();
//         }
//     };

//     useEffect(() => {
//         fetchDocInfo();
//     }, [doctors, docId]);

//     useEffect(() => {
//         if (docInfo) {
//             getAvailableSlots();
//         }
//     }, [docInfo]);

//     const formatDateHeader = (date) => {
//         const today = new Date();
//         const tomorrow = new Date(today);
//         tomorrow.setDate(today.getDate() + 1);

//         if (date.toDateString() === today.toDateString()) {
//             return 'Today';
//         } else if (date.toDateString() === tomorrow.toDateString()) {
//             return 'Tomorrow';
//         } else {
//             return daysOfWeek[date.getDay()];
//         }
//     };

//     return docInfo ? (
//         <div className="max-w-6xl mx-auto px-4 py-8">
//             {/* Doctor Profile Section */}
//             <div className="flex flex-col md:flex-row gap-8 mb-12">
//                 <div className="md:w-1/3 lg:w-1/4">
//                     <img
//                         className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md"
//                         src={docInfo.image}
//                         alt={docInfo.name}
//                     />
//                 </div>

//                 <div className="md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-md p-6">
//                     <div className="flex items-start justify-between">
//                         <div>
//                             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//                                 {docInfo.name}
//                                 <FaCheckCircle className="text-blue-500" />
//                             </h1>
//                             <div className="flex items-center gap-3 mt-2">
//                                 <p className="text-gray-600">
//                                     {docInfo.degree} - {docInfo.speciality}
//                                 </p>
//                                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                                     {docInfo.experience} years exp
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
//                             <p className="font-bold">
//                                 {currencySymbol}
//                                 {docInfo.fees}
//                                 <span className="text-sm font-normal ml-1">consultation fee</span>
//                             </p>
//                         </div>
//                     </div>

//                     <div className="mt-6">
//                         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                             <HiOutlineInformationCircle className="text-gray-600" />
//                             About
//                         </h3>
//                         <p className="text-gray-600 mt-2 leading-relaxed">{docInfo.about}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Booking Section */}
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Left Side - Booking Form */}
//                 <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6 mb-12">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

//                     {/* Date Selector */}
//                     <div className="mb-8">
//                         <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                             <BsCalendarDay />
//                             Select Date
//                         </h3>
//                         <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
//                             {docSlots.length > 0 &&
//                                 docSlots.map((slots, index) => {
//                                     const date = slots[0]?.datetime || new Date();
//                                     return (
//                                         <button
//                                             key={index}
//                                             onClick={() => setSlotIndex(index)}
//                                             className={`flex flex-col items-center p-3 rounded-lg transition-all ${
//                                                 slotIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'
//                                             }`}
//                                             aria-pressed={slotIndex === index}
//                                         >
//                                             <span className="text-sm font-medium">{formatDateHeader(date)}</span>
//                                             <span className="text-lg font-bold mt-1">{date.getDate()}</span>
//                                             <span className="text-xs">{months[date.getMonth()]}</span>
//                                         </button>
//                                     );
//                                 })}
//                         </div>
//                     </div>

//                     {/* Time Slot Selector */}
//                     <div>
//                         <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                             <BsClock />
//                             Select Time
//                         </h3>
//                         {docSlots[slotIndex]?.length > 0 ? (
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                                 {docSlots[slotIndex].map((slot, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => setSlotTime(slot.time)}
//                                         className={`py-3 px-4 rounded-lg border transition-all ${
//                                             slot.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'
//                                         }`}
//                                     >
//                                         {slot.time}
//                                     </button>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 py-4">No available slots for this day</p>
//                         )}
//                     </div>

//                     {/* Consultation Type Selector */}
//                     <div className="mt-8 mb-6">
//                         <h3 className="text-md font-semibold text-gray-700 mb-4">Consultation Type</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <button
//                                 onClick={() => setConsultationType('Video Consultation')}
//                                 className={`p-4 rounded-lg border transition-all ${
//                                     consultationType === 'Video Consultation' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                                 }`}
//                             >
//                                 <div className="flex items-start gap-3">
//                                     <div
//                                         className={`p-2 rounded-full ${
//                                             consultationType === 'Video Consultation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
//                                         }`}
//                                     >
//                                         <FaVideo className="h-5 w-5" />
//                                     </div>
//                                     <div>
//                                         <h4 className="font-medium text-gray-800">Video Consultation</h4>
//                                         <p className="text-sm text-gray-600 mt-1">Consult with doctor via video call</p>
//                                     </div>
//                                 </div>
//                             </button>
//                             <button
//                                 onClick={() => setConsultationType('In-person Visit')}
//                                 className={`p-4 rounded-lg border transition-all ${
//                                     consultationType === 'In-person Visit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                                 }`}
//                             >
//                                 <div className="flex items-start gap-3">
//                                     <div
//                                         className={`p-2 rounded-full ${
//                                             consultationType === 'In-person Visit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
//                                         }`}
//                                     >
//                                         <FaClinicMedical className="h-5 w-5" />
//                                     </div>
//                                     <div>
//                                         <h4 className="font-medium text-gray-800">In-person Visit</h4>
//                                         <p className="text-sm text-gray-600 mt-1">Visit the doctor at their clinic</p>
//                                     </div>
//                                 </div>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Payment Method Selector */}
//                     <div className="mt-8 mb-6">
//                         <h3 className="text-md font-semibold text-gray-700 mb-4">Payment Method</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <button
//                                 onClick={() => setPaymentMethod('Khalti')}
//                                 className={`p-4 rounded-lg border transition-all ${
//                                     paymentMethod === 'Khalti' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                                 }`}
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <MdPayment className="w-6 h-6 text-purple-600" />
//                                     <span className="font-medium text-gray-800">Pay Online (Khalti)</span>
//                                 </div>
//                             </button>
//                             <button
//                                 onClick={() => setPaymentMethod('Cash')}
//                                 className={`p-4 rounded-lg border transition-all ${
//                                     paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
//                                 }`}
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <FaMoneyBillWave className="w-6 h-6 text-green-600" />
//                                     <span className="font-medium text-gray-800">Pay at Clinic (Cash)</span>
//                                 </div>
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Booking Summary */}
//                 <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h2>

//                     <div className="space-y-4">
//                         <div className="flex justify-between">
//                             <span className="text-gray-600">Doctor:</span>
//                             <span className="font-medium">Dr. {docInfo.name}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-600">Date:</span>
//                             <span className="font-medium">
//                                 {docSlots[slotIndex]?.length > 0
//                                     ? `${daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, ${
//                                         months[docSlots[slotIndex][0].datetime.getMonth()]
//                                     } ${docSlots[slotIndex][0].datetime.getDate()}, ${docSlots[slotIndex][0].datetime.getFullYear()}`
//                                     : 'Not selected'}
//                             </span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-600">Time:</span>
//                             <span className="font-medium">{slotTime || 'Not selected'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-600">Type:</span>
//                             <span className="font-medium">{consultationType}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-600">Payment:</span>
//                             <span className="font-medium">{paymentMethod === 'Khalti' ? 'Pay Online (Khalti)' : 'Pay at Clinic (Cash)'}</span>
//                         </div>

//                         <div className="border-t border-gray-200 pt-4 mt-4">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-800 font-medium">Total Amount:</span>
//                                 <span className="font-bold text-blue-600">
//                                     {currencySymbol}
//                                     {docInfo.fees}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8">
//                         <button
//                             onClick={bookAppointment}
//                             disabled={!slotTime || isPaying}
//                             className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
//                                 slotTime && !isPaying ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
//                             }`}
//                         >
//                             {isPaying ? 'Processing Payment...' : 'Confirm Booking'}
//                         </button>
//                     </div>

//                     <div className="mt-4 text-xs text-gray-500 text-center">
//                         <p>
//                             By booking this appointment, you agree to our{' '}
//                             <a className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
//                             <a className="text-blue-600 hover:underline">Privacy Policy</a>.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Related Doctors */}
//             <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//         </div>
//     ) : (
//         <div className="text-center py-8">Loading...</div>
//     );
// };

// export default Appointment;



// // second choice
// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import RelatedDoctors from '../components/RelatedDoctors';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import KhaltiCheckout from 'khalti-checkout-web';
// import { FaVideo, FaClinicMedical, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
// import { HiOutlineInformationCircle } from 'react-icons/hi';
// import { MdPayment } from 'react-icons/md';
// import { BsCalendarDay, BsClock } from 'react-icons/bs';

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const navigate = useNavigate();
//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [consultationType, setConsultationType] = useState('Video Consultation');
//   const [paymentMethod, setPaymentMethod] = useState('Khalti');

//   const fetchDocInfo = async () => {
//     const docInfo = doctors?.find(doc => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   const getAvailableSlots = async () => {
//     setDocslots([]);
//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date(currentDate);
//       endTime.setHours(19, 0, 0, 0);

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(currentDate.getHours() >10 ? currentDate.getHours() + 1 : 10);
//         currentDate.setMinutes(currentDate.getMinutes() > 0 ? 0 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];
//       while (currentDate < endTime) {

//         const currentHour = currentDate.getHours();
//         if (currentHour === 14) { // 2:00 PM to 2:59 PM
//           currentDate.setHours(15); // Jump to 3:00 PM
//           currentDate.setMinutes(0);
//           continue;
//         }
  
//         let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        

//         let day = currentDate.getDate();
//         let month = currentDate.getMonth() + 1;
//         let year = currentDate.getFullYear();

//         const slotDate = day + "_" + month + "_" + year;
//         const slotTime = formattedTime;

//         const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

//         if (isSlotAvailable) {
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime
//           });
//         }

//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }
//       setDocslots(prev => ([...prev, timeSlots]));
//     }
//   };

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn('Please login to book an appointment');
//       return navigate('/login');
//     }

//     if (!slotTime) {
//       toast.warn('Please select a time slot');
//       return;
//     }

//     try {
//       const date = docSlots[slotIndex][0].datetime;
//       let day = date.getDate();
//       let month = date.getMonth() + 1;
//       let year = date.getFullYear();
//       const slotDate = day + "_" + month + "_" + year;

//       const { data } = await axios.post(
//         backendUrl + '/api/user/book-appointment',
//         { docId, slotDate, slotTime, consultationType, paymentMethod },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getDoctorsData();
//         navigate('/my-appointment');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   const formatDateHeader = (date) => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) {
//       return 'Today';
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return 'Tomorrow';
//     } else {
//       return daysOfWeek[date.getDay()];
//     }
//   };
// // Khalti Configuration
// const khaltiConfig = {
//   publicKey: "84d65d807f78402fb84a03a411fd849f",
//   productIdentity: "1234567890",
//   productName: "Doctor appointment system",
//   productUrl: "http://localhost:3000/",
//   eventHandler: {
//       onSuccess(payload) {
//           console.log("Payment Successful", payload);
//           alert("Khalti Payment successful! Appointment confirmed.");

//           // Optionally send payment payload to backend for verification
//           payWithKhalti(payload);  // Call function with payload
//       },
//       onError(error) {
//           console.log("Payment Error", error);
//           alert("Khalti Payment failed. Try again.");
//       },
//       onClose() {
//           console.log("Payment closed.");
//       },
//   },
//   paymentPreference: ["KHALTI"],
// };

// const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

// // Show Khalti Payment Modal
// const handleKhaltiPayment = () => {
//   khaltiCheckout.show({ amount: 1000 }); // Amount in paisa (e.g., Rs.10 = 1000 paisa)
// };

// // Send Payment Info to Backend
// const payWithKhalti = async (payload) => {
//   try {
//       const response = await fetch(`http://localhost:4000/khalti/complete-khalti-payment`, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//               token: payload.token,
//               amount: payload.amount,
//               product_identity: khaltiConfig.productIdentity,
//               buyer_name: "som"  // You can replace this dynamically
//           })
//       });

//       const data = await response.json();
//       console.log(data);

//       if (response.status === 200) {
//           alert("Khalti payment verified with backend!");
//           // Optionally redirect or update UI
//       } else {
//           alert("Payment verification failed.");
//       }
//   } catch (error) {
//       console.error("Error verifying Khalti payment:", error);
//   }
// };

// return docInfo && (
//   <div className="max-w-6xl mx-auto px-4 py-8">
//     {/* Doctor Profile Section */}
//     <div className="flex flex-col md:flex-row gap-8 mb-12">
//       <div className="md:w-1/3 lg:w-1/4">
//         <img 
//           className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md" 
//           src={docInfo.image} 
//           alt={docInfo.name} 
//         />
//       </div>

//       <div className="md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               {docInfo.name}
//               <FaCheckCircle className="text-blue-500" />
//             </h1>
//             <div className="flex items-center gap-3 mt-2">
//               <p className="text-gray-600">
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                 {docInfo.experience} years exp
//               </span>
//             </div>
//           </div>
//           <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
//             <p className="font-bold">
//               {currencySymbol}{docInfo.fees}
//               <span className="text-sm font-normal ml-1">consultation fee</span>
//             </p>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <HiOutlineInformationCircle className="text-gray-600" />
//             About
//           </h3>
//           <p className="text-gray-600 mt-2 leading-relaxed">
//             {docInfo.about}
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Booking Section */}
//     <div className="flex flex-col lg:flex-row gap-8">
//       {/* Left Side - Booking Form */}
//       <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6 mb-12">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
        
//         {/* Date Selector */}
//         <div className="mb-8">
//           <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//             <BsCalendarDay />
//             Select Date
//           </h3>
//           <div className="grid grid-cols-7 gap-2">
//             {docSlots.length > 0 && docSlots.map((slots, index) => {
//               const date = slots[0]?.datetime || new Date();
//               return (
//                 <button
//                   key={index}
//                   onClick={() => setSlotIndex(index)}
//                   className={`flex flex-col items-center p-3 rounded-lg transition-all ${slotIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
//                 >
//                   <span className="text-sm font-medium">
//                     {formatDateHeader(date)}
//                   </span>
//                   <span className="text-lg font-bold mt-1">
//                     {date.getDate()}
//                   </span>
//                   <span className="text-xs">
//                     {months[date.getMonth()]}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Time Slot Selector */}
//         <div>
//           <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
//             <BsClock />
//             Select Time
//           </h3>
//           {docSlots[slotIndex]?.length > 0 ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//               {docSlots[slotIndex].map((slot, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSlotTime(slot.time)}
//                   className={`py-3 px-4 rounded-lg border transition-all ${slot.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
//                 >
//                   {slot.time}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 py-4">No available slots for this day</p>
//           )}
//         </div>

//         {/* Consultation Type Selector */}
//         <div className="mt-8 mb-6">
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Consultation Type</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button
//               onClick={() => setConsultationType('Video Consultation')}
//               className={`p-4 rounded-lg border transition-all ${consultationType === 'Video Consultation' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
//             >
//               <div className="flex items-start gap-3">
//                 <div className={`p-2 rounded-full ${consultationType === 'Video Consultation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
//                   <FaVideo className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-800">Video Consultation</h4>
//                   <p className="text-sm text-gray-600 mt-1">Consult with doctor via video call</p>
//                 </div>
//               </div>
//             </button>
//             <button
//               onClick={() => setConsultationType('In-person Visit')}
//               className={`p-4 rounded-lg border transition-all ${consultationType === 'In-person Visit' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
//             >
//               <div className="flex items-start gap-3">
//                 <div className={`p-2 rounded-full ${consultationType === 'In-person Visit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
//                   <FaClinicMedical className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-800">In-person Visit</h4>
//                   <p className="text-sm text-gray-600 mt-1">Visit the doctor at their clinic</p>
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Payment Method Selector */}
//         <div className="mt-8 mb-6">
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Payment Method</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button
//               onClick={() => setPaymentMethod('Khalti')}
//               className={`p-4 rounded-lg border transition-all ${paymentMethod === 'Khalti' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
//             >
//               <div className="flex items-center gap-3">
//                 <MdPayment className="w-6 h-6 text-purple-600" />
//                 <span className="font-medium text-gray-800">Pay Online (Khalti)</span>
//               </div>
//             </button>
//             <button
//               onClick={() => setPaymentMethod('Cash')}
//               className={`p-4 rounded-lg border transition-all ${paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
//             >
//               <div className="flex items-center gap-3">
//                 <FaMoneyBillWave className="w-6 h-6 text-green-600" />
//                 <span className="font-medium text-gray-800">Pay at Clinic (Cash)</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Booking Summary */}
//       <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h2>
        
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Doctor:</span>
//             <span className="font-medium">Dr. {docInfo.name}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Date:</span>
//             <span className="font-medium">
//               {docSlots[slotIndex]?.length > 0 
//                 ? `${daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, ${months[docSlots[slotIndex][0].datetime.getMonth()]} ${docSlots[slotIndex][0].datetime.getDate()}, ${docSlots[slotIndex][0].datetime.getFullYear()}`
//                 : 'Not selected'}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Time:</span>
//             <span className="font-medium">{slotTime || 'Not selected'}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Type:</span>
//             <span className="font-medium">{consultationType}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Payment:</span>
//             <span className="font-medium">{paymentMethod}</span>
//           </div>
          
//           <div className="border-t border-gray-200 pt-4 mt-4">
//             <div className="flex justify-between">
//               <span className="text-gray-800 font-medium">Total Amount:</span>
//               <span className="font-bold text-blue-600">{currencySymbol}{docInfo.fees}</span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={bookAppointment}
//             disabled={!slotTime}
//             className={`w-full py-3 rounded-lg font-medium text-white transition-all ${slotTime ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
//           >
//             Confirm Booking
//           </button>
//         </div>

//         <div className="mt-4 text-xs text-gray-500 text-center">
//           <p>By booking this appointment, you agree to our <a 
//          className="text-blue-600 hover:underline">Terms of Service</a> and <a className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
//         </div>
//       </div>
//     </div>

//     {/* Related Doctors */}
//     <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//   </div>
// );
// };

// export default Appointment;









// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import RelatedDoctors from '../components/RelatedDoctors';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   const navigate = useNavigate();
//   const [docInfo, setDocInfo] = useState(null);
//   const [docSlots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const fetchDocInfo = async () => {
//     const docInfo = doctors?.find(doc => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   const getAvailableSlots = async () => {
//     setDocslots([]);
//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date(currentDate);
//       endTime.setHours(19, 0, 0, 0);

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(currentDate.getHours() >10 ? currentDate.getHours() + 1 : 10);
//         currentDate.setMinutes(currentDate.getMinutes() > 0 ? 0 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];
//       while (currentDate < endTime) {

//         const currentHour = currentDate.getHours();
//         if (currentHour === 14) { // 2:00 PM to 2:59 PM
//           currentDate.setHours(15); // Jump to 3:00 PM
//           currentDate.setMinutes(0);
//           continue;
//         }
  
//         let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        

//         let day = currentDate.getDate();
//         let month = currentDate.getMonth() + 1;
//         let year = currentDate.getFullYear();

//         const slotDate = day + "_" + month + "_" + year;
//         const slotTime = formattedTime;

//         const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

//         if (isSlotAvailable) {
//           timeSlots.push({
//             datetime: new Date(currentDate),
//             time: formattedTime
//           });
//         }

//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }
//       setDocslots(prev => ([...prev, timeSlots]));
//     }
//   };

//   const bookAppointment = async () => {
//     if (!token) {
//       toast.warn('Please login to book an appointment');
//       return navigate('/login');
//     }

//     if (!slotTime) {
//       toast.warn('Please select a time slot');
//       return;
//     }

//     try {
//       const date = docSlots[slotIndex][0].datetime;
//       let day = date.getDate();
//       let month = date.getMonth() + 1;
//       let year = date.getFullYear();
//       const slotDate = day + "_" + month + "_" + year;

//       const { data } = await axios.post(
//         backendUrl + '/api/user/book-appointment',
//         { docId, slotDate, slotTime },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getDoctorsData();
//         navigate('/my-appointment');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   const formatDateHeader = (date) => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toDateString() === today.toDateString()) {
//       return 'Today';
//     } else if (date.toDateString() === tomorrow.toDateString()) {
//       return 'Tomorrow';
//     } else {
//       return daysOfWeek[date.getDay()];
//     }
//   };

//   return docInfo && (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Doctor Profile Section */}
//       <div className="flex flex-col md:flex-row gap-8 mb-12">
//         <div className="md:w-1/3 lg:w-1/4">
//           <img 
//             className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md" 
//             src={docInfo.image} 
//             alt={docInfo.name} 
//           />
//         </div>

//         <div className="md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-md p-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//                 {docInfo.name}
//                 <img className="w-5 h-5" src={assets.verified_icon} alt="verified" />
//               </h1>
//               <div className="flex items-center gap-3 mt-2">
//                 <p className="text-gray-600">
//                   {docInfo.degree} - {docInfo.speciality}
//                 </p>
//                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                   {docInfo.experience} years exp
//                 </span>
//               </div>
//             </div>
//             <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
//               <p className="font-bold">
//                 {currencySymbol}{docInfo.fees}
//                 <span className="text-sm font-normal ml-1">consultation fee</span>
//               </p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <img src={assets.info_icon} alt="info" className="w-4 h-4" />
//               About
//             </h3>
//             <p className="text-gray-600 mt-2 leading-relaxed">
//               {docInfo.about}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Booking Section */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-12">
//         <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
        
//         {/* Date Selector */}
//         <div className="mb-8">
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Select Date</h3>
//           <div className="grid grid-cols-7 gap-2">
//             {docSlots.length > 0 && docSlots.map((slots, index) => {
//               const date = slots[0]?.datetime || new Date();
//               return (
//                 <button
//                   key={index}
//                   onClick={() => setSlotIndex(index)}
//                   className={`flex flex-col items-center p-3 rounded-lg transition-all ${slotIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
//                 >
//                   <span className="text-sm font-medium">
//                     {formatDateHeader(date)}
//                   </span>
//                   <span className="text-lg font-bold mt-1">
//                     {date.getDate()}
//                   </span>
//                   <span className="text-xs">
//                     {months[date.getMonth()]}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Time Slot Selector */}
//         <div>
//           <h3 className="text-md font-semibold text-gray-700 mb-4">Available Time Slots</h3>
//           {docSlots[slotIndex]?.length > 0 ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//               {docSlots[slotIndex].map((slot, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSlotTime(slot.time)}
//                   className={`py-3 px-4 rounded-lg border transition-all ${slot.time === slotTime ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}
//                 >
//                   {slot.time}
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 py-4">No available slots for this day</p>
//           )}
//         </div>

//         {/* Book Button */}
//         <div className="mt-8 flex justify-end">
//           <button
//             onClick={bookAppointment}
//             disabled={!slotTime}
//             className={`px-8 py-3 rounded-full font-medium text-white transition-all ${slotTime ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
//           >
//             Confirm Appointment
//           </button>
//         </div>
//       </div>

//       {/* Related Doctors */}
//       <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//     </div>
//   );
// };

// export default Appointment;