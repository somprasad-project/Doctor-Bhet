import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointment = () => {

  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  //api call for the age calculator
  const {calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(()=> {
    if (aToken) {
      getAllAppointments()
    }
  },[aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-floe-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>

        {appointments.slice().reverse().map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
          <p className='max-sm:hidden'>{index+1}</p>
          <div className='flex items-center gap-2'>
            <img className='w-11 rounded-full' src={item.userData.image} alt=" " /> <p>{item.userData.name}</p>
            </div>
            {/* age calculate */}
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            {/* time slot */}
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
            <img className='w-11 rounded-full' src={item.docData.image} alt=" " /> <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>


                {
                            item.cancelled
                              ? <p className='text-red-500 text-xs-medium'>Cancelled</p>
                              : item.isCompleted
                                ? <p className='text-green-500 text-xs-medium'>Completed</p>
                                : <div className='flex'>
                                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt=" " />
            
                                </div>
                          }

          </div>
        ))}
      </div>

    </div>
  )
}

export default AllAppointment