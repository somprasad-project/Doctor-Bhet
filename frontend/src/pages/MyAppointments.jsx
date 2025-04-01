
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const months = [" ", "Jan", "Feb", "Mar", "Apr", " May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

        const slotDateFormat = (slotDate) => {
    
            const dateArray = slotDate.split('_')
            return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    
        }
    

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            // Show confirmation dialog using SweetAlert2
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to cancel this appointment?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it'
            });

            // If the user confirms, proceed with cancellation
            if (result.isConfirmed) {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/cancel-appointment`,
                    { appointmentId },
                    { headers: { token } }
                );

                if (data.success) {
                    toast.success(data.message);
                    getUserAppointments(); // Refresh the appointments list
                    getDoctorsData(); // Refresh doctor data if needed
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

            {appointments.length === 0 ? (
                <p className='text-zinc-600'>No appointments found.</p>
            ) : (
                <div>
                    {appointments.map((item, index) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2.5 border-b' key={index}>
                            <div>
                                <img className='w-40 bg-indigo-50' src={item.docData.image} alt={`Dr. ${item.docData.name}`} />
                            </div>

                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-netural-800 font-semibold'>{item.docData.name}</p>
                                <p>{item.docData.speciality}</p>
                                <p className='text-zinc-700 font-medium mt-2.5'>Address:</p>
                                <p className='text-xs'>{item.docData.address.line1}</p>
                                <p className='text-xs'>{item.docData.address.line2}</p>
                                <p className='text-xs mt-2.5'>
                                    <span className='text-sm text-netural-700 font-medium'>Date & Time: </span>
                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>
                            </div>

                            <div className='flex flex-col gap-2 justify-end'>
                                {!item.cancelled && (
                                    <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                                        Pay Online
                                    </button>
                                )}
                                {!item.cancelled && (
                                    <button
                                        onClick={() => cancelAppointment(item._id)}
                                        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                                {item.cancelled && (
                                    <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                                        Appointment Cancelled
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;




// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import Swal from 'sweetalert2'

// const MyAppointments = () => {

    

//     const { backendUrl, token, getDoctorsData } = useContext(AppContext)

//     const [appointments, setAppointments] = useState([])

//     const months = [" ", "Jan", "Feb", "Mar", "Apr", " May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

//     const slotDateFormat = (slotDate) => {

//         const dateArray = slotDate.split('_')
//         return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]

//     }



//     const getUserAppointments = async () => {
//         try {

//             const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

//             if (data.success) {

//                 setAppointments(data.appointments.reverse())
//                 console.log(data.appointments);

//             }

//         } catch (error) {

//             console.log(error)
//             toast.error(error.message)

//         }
//     }


//     const cancelAppointment = async (appointmentId) => {
//         try {

//             const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

//             if (data.success) {

//                 toast.success(data.message)
//                 getUserAppointments()
//                 getDoctorsData()


//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {

//             console.log(error)
//             toast.error(error.message)


//         }
//     }


//     useEffect(() => {

//         if (token) {

//             getUserAppointments()

//         }

//     }, [token])



//     return (
//         <div>
//             <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

//             <div>
//                 {appointments.map((item, index) =>
//                     <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2.5 border-b' key={index}>
//                         <div>
//                             <img className=' w-40 bg-indigo-50' src={item.docData.image} alt=" " />
//                         </div>

//                         <div className='flex-1 text-sm text-zinc-600'>
//                             <p className='text-netural-800 font-semibold'>{item.docData.name}</p>
//                             <p>{item.docData.speciality}</p>
//                             <p className='text-zinc-700 font-medium mt-2.5' >Address:</p>
//                             <p className='text-xs'>{item.docData.address.line1}</p>
//                             <p className='text-xs'>{item.docData.address.line2}</p>
//                             <p className='text-xs mt-2.5'><span className='text-sm text-netural-700 font-medium ' >Date & Time: </span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
//                         </div>
//                         <div></div>

//                         <div className='flex flex-col gap-2 justify-end'>
//                             {!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
//                             {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
//                             {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default MyAppointments