import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Swal from 'sweetalert2'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to cancel this appointment.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        cancelAppointment(id)
        Swal.fire('Cancelled!', 'The appointment has been cancelled.', 'success')
      }
    })
  }

  const handleComplete = (id) => {
    Swal.fire({
      title: 'Mark as Completed?',
      text: "This will mark the appointment as completed.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        completeAppointment(id)
        Swal.fire('Completed!', 'The appointment has been marked as completed.', 'success')
      }
    })
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[80vh] overflow-y-scroll'>

        {/* Header Row */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Consultation</p>
          <p>Date and Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Data Rows */}
        {
          appointments.slice().reverse().map((item, index) => (
            <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} alt={item.userData.name} className='w-11 rounded-full' />
                <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>{item.payment ? 'Online' : 'CASH'}</p>
              </div>
              <p className='max-sm:hidden'>{item.consultationType}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              {
                item.cancelled
                  ? <p className='text-red-500 text-xs-medium'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs-medium'>Completed</p>
                    : <div className='flex gap-2'>
                        <img onClick={() => handleCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="Cancel" />
                        <img onClick={() => handleComplete(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                      </div>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default DoctorAppointments






// import React from 'react'
// import { useContext } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { useEffect } from 'react'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets'

// const DoctorAppointments = () => {

//   const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)

//   const { calculateAge, slotDateFormat, currency } = useContext(AppContext)


//   useEffect(() => {
//     if (dToken) {
//       getAppointments()
//     }

//   }, [dToken])



//   return (

//     <div className='w-full max-w-6xl m-5'>
//       <p className='mb-3 text-lg font-medium'>All Appointments</p>
//       <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[80vh] overflow-y-scroll'>

//         {/* Header Row */}
//         <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
//           <p>#</p>
//           <p>Patient</p>
//           <p>Payment</p>
//           <p>Age</p>
//           <p>Date and Time</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>

//         {/* Data Rows */}
//         {
//           appointments.slice().reverse().map((item, index) => (
//             <div key={index} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' >
//               <p className='max-sm:hidden'>{index + 1}</p>
//               <div className='flex items-center gap-2'>
//                 <img src={item.userData.image} alt={item.userData.name} className='w-11 rounded-full' />
//                 <p>{item.userData.name}</p>
//               </div>
//               <div>
//                 <p className='text-xs inline border border-primary px-2 rounded-full'>{item.payment ? 'Online' : 'CASH'}</p>
//               </div>
//               <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
//               <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
//               <p>{currency}{item.amount}</p>
//               {
//                 item.cancelled
//                   ? <p className='text-red-500 text-xs-medium'>Cancelled</p>
//                   : item.isCompleted
//                     ? <p className='text-green-500 text-xs-medium'>Completed</p>
//                     : <div className='flex'>
//                       <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt=" " />
//                       <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt=" " />

//                     </div>
//               }


//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorAppointments