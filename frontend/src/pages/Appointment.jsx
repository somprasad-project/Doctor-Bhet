
// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol } = useContext(AppContext);
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const [docInfo, setDocInfo] = useState(null);
//   const [docslots, setDocslots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);

//   // Fetch doctor info based on docId
//   const fetchDocInfo = async () => {
//     const docInfo = doctors?.find((doc) => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   // Generate available slots for the next 7 days
//   const getAvailableSlots = async () => {
//     setDocslots([]); // Clear previous slots
//     const today = new Date();

//     for (let i = 0; i < 7; i++) {
//       const currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       const endTime = new Date(currentDate);
//       endTime.setHours(21, 0, 0, 0); // End time for the day is 9 PM

//       if (today.getDate() === currentDate.getDate()) {
//         currentDate.setHours(
//           currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
//         );
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10, 0, 0, 0); // Start time for other days is 10 AM
//       }

//       const timeSlots = [];
//       while (currentDate < endTime) {
//         timeSlots.push({
//           datetime: new Date(currentDate),
//           time: currentDate.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         });
//         currentDate.setMinutes(currentDate.getMinutes() + 60); // Increment by 1 hour
//       }

//       setDocslots((prev) => [...prev, timeSlots]);
//     }
//   };

//   // Fetch doctor info on component mount or when docId changes
//   useEffect(() => {
//     fetchDocInfo();
//   }, [doctors, docId]);

//   // Generate available slots when doctor info is fetched
//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, [docInfo]);

//   // Render component
//   return (
//     docInfo && (
//       <div>
//         {/* Doctor Details */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img
//               className="bg-primary w-full sm:max-w-72 rounded-lg"
//               src={docInfo.image}
//               alt=""
//             />
//           </div>
//           {/* Doctor Info */}
//           <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//               {docInfo.name}
//               <img className="w-5" src={assets.verified_icon} alt="" />
//             </p>
//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">
//                 {docInfo.experience}
//               </button>
//             </div>
//             <div>
//               <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
//                 About
//                 <img src={assets.info_icon} alt="" />
//               </p>
//               <p className="text-sm text-gray-500 max-w-[700px] mt-1">
//                 {docInfo.about}
//               </p>
//             </div>
//             <p className="text-gray-500 font-bold mt-4">
//               Appointment fee:
//               <span className="text-green-600">
//                 {currencySymbol}
//                 {docInfo.fees}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Booking Slots */}
//         <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//           <p>Booking slots</p>
//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {docslots.length > 0 &&
//               docslots.map((item, index) => (
//                 <div
//                   onClick={() => setSlotIndex(index)}
//                   className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                     slotIndex === index
//                       ? "bg-primary text-white"
//                       : "border border-gray-200"
//                   }`}
//                   key={index}
//                 >
//                   <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                   <p>{item[0] && item[0].datetime.getDate()}</p>
//                 </div>
//               ))}
//           </div>

//               <div className='flex items-center gap-3 w-full overflow-x-scroll mt 4'>
//                 {docslots.length && docslots[slotIndex].map((item, index)=> (
//                   <p className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ` }key={index}>
//                     {item.time.toLowerCase()}

//                   </p>
//                 ))}
//               </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Appointment;








import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors,  currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON' , 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null);
  const [docslots, setDocslots] = useState([])
  const [slotIndex,setSlotIndex] =useState(0)
  const[slotTime,setSlotTime] = useState('')

  const fetchDocInfo = async() => {
    const docInfo = doctors?.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  }

  const getAvailableSlots= async () =>{
    setDocslots([])

    let toady =new Date()
    for(let i=0 ; i < 7 ; i++){
      //getting date with index
    let currentDate =new Date(toady)
    currentDate.setDate(toady.getDate()+i)

    //setting end time of the date with index 
    let endTime = new Date()
    endTime.setDate(toady.getDate()+ i)
    endTime.setHours(21,0,0,0)

    //setting hours

    if(toady.getDate()=== currentDate.getDate()){
      currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours()+1 : 10 )
      currentDate.setMinutes(currentDate.getMinutes()> 30? 30:0)

    }else{
      currentDate.setHours(10)
      currentDate.setMinutes(0)
    }

    let timeSlots =[]
    while(currentDate < endTime){
      let formattedTime = currentDate.toLocaleDateString([], {hour:'2-digit', minute:'2-digit'})

      // add slot to array
      timeSlots.push({
        datetime:new Date(currentDate),
        time : formattedTime
      })

      // increment current time by 1 hours
      currentDate.setMinutes(currentDate.getMinutes() + 60 )
    }
    setDocslots(prev =>([...prev, timeSlots]))
  }
  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  },[docInfo])

  useEffect(() => {
    console.log(docslots);
  },[docslots])


  return docInfo && (
   <div>
    {/* ----------- Docotr Detail ----------------- */}
    <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={ docInfo.image} alt="" />
        </div>
    {/* ----------- Docotr info-----------------    */}
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex item-center gap-2 text-2xl font-medium text-gray-900 '>{docInfo.name} 
              <img className=' w-5 'src={assets.verified_icon} alt=""/></p>

            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>

              {/* ----------- Docotr about-----------------    */}

              <div>
                <p className='flec items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt=""/></p>
                <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
              </div>
              <p className='text-gray-500 font-bold mt-4'>
                Appointment fee:<span className='text-green-600'>{currencySymbol}{docInfo.fees}</span>
              </p>
        </div>
    </div>
    {/* ----------- bOOKING SLOTS-----------------    */}  
    <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
      <p>Booking slots</p>
        
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docslots.length && docslots.map((item, index)=>(
                <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border bordr-gray-200'}`} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>

              ))
            }
        </div>
        <div className='flex item-center gap-3 w-full overflow-x-scroll mt-4'>
          {docslots.length && docslots[slotIndex].map((item, index)=>(
            <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key = {index}>
              {item.time.toLowerCase()}

            </p>

          ))}
        </div>
        <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
    </div>

      {/* ----------- listing realted doctor-----------------    */}  
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

   </div>
  )
}
export default Appointment;
