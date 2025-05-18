


// import React, { useContext, useEffect, useState } from 'react';
// import { DoctorContext } from '../../context/DoctorContext';
// import { toast } from 'react-toastify';
// import { 
//   FaVideo, 
//   FaUser, 
//   FaCalendarAlt, 
//   FaClock, 
//   FaSpinner,
//   FaPhoneSlash,
//   FaCheckCircle,
//   FaTimesCircle
// } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Menu, Transition } from '@headlessui/react';
// import VideoCall from '../../components/VideoCall';
// import axios from 'axios';
// import { format, parse, isWithinInterval, addMinutes, subMinutes } from 'date-fns';

// const VideoConsultations = () => {
//   const { 
//     dToken, 
//     appointments, 
//     getAppointments,
//     profileData,
//     completeAppointment,
//     cancelAppointment,
//     backendUrl
//   } = useContext(DoctorContext);
  
//   const [loading, setLoading] = useState(true);
//   const [activeVideoCall, setActiveVideoCall] = useState(null);
//   const [filter, setFilter] = useState('upcoming');
//   const [callStarting, setCallStarting] = useState(false);

//   // Format date from "DD_MM_YYYY" to readable format
//   const formatAppointmentDate = (dateStr) => {
//     const [day, month, year] = dateStr.split('_').map(Number);
//     return format(new Date(year, month - 1, day), 'MMMM do, yyyy');
//   };

//   // Check if current time is within call window (15 mins before to 30 mins after)
//   const canStartCall = (appointment) => {
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

//   const handleStartCall = async (appointment) => {
//     if (!canStartCall(appointment)) {
//       toast.error(`Call is not available yet. ${getCallWindowMessage(appointment)}`);
//       return;
//     }

//     setCallStarting(true);
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/doctor/appointments/${appointment._id}/call-details`,
//         { headers: { token: dToken } }
//       );
      
//       if (data.success) {
//         setActiveVideoCall({
//           ...appointment,
//           roomName: data.roomName,
//           password: data.password,
//           patient: data.patient
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

//   const confirmCompleteAppointment = async (appointmentId) => {
//     try {
//       await completeAppointment(appointmentId);
//       toast.success('Appointment marked as completed');
//     } catch (error) {
//       toast.error('Failed to complete appointment');
//     }
//   };

//   const filteredAppointments = appointments.filter(appt => {
//     if (appt.consultationType !== 'video') return false;
    
//     switch (filter) {
//       case 'upcoming':
//         return !['completed', 'cancelled'].includes(appt.status);
//       case 'completed':
//         return appt.status === 'completed';
//       case 'cancelled':
//         return appt.status === 'cancelled';
//       default:
//         return true;
//     }
//   });

//   useEffect(() => {
//     if (dToken) {
//       getAppointments().finally(() => setLoading(false));
//     }
//   }, [dToken, getAppointments]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Video Consultations</h1>
      
//       {/* Filter Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           onClick={() => setFilter('upcoming')}
//           className={`px-4 py-2 font-medium ${filter === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Upcoming ({filteredAppointments.filter(a => !['completed', 'cancelled'].includes(a.status)).length})
//         </button>
//         <button
//           onClick={() => setFilter('completed')}
//           className={`px-4 py-2 font-medium ${filter === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Completed ({filteredAppointments.filter(a => a.status === 'completed').length})
//         </button>
//         <button
//           onClick={() => setFilter('cancelled')}
//           className={`px-4 py-2 font-medium ${filter === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//         >
//           Cancelled ({filteredAppointments.filter(a => a.status === 'cancelled').length})
//         </button>
//       </div>

//       {/* Appointments List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <FaVideo className="mx-auto text-4xl text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-700">
//             {filter === 'upcoming' 
//               ? 'No upcoming video consultations' 
//               : filter === 'completed' 
//                 ? 'No completed consultations' 
//                 : 'No cancelled consultations'}
//           </h3>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <div key={appointment._id} className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-blue-500">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   {/* Patient Info */}
//                   <div className="flex items-center gap-4">
//                     <div className="bg-blue-100 rounded-full p-3">
//                       <FaUser className="text-blue-600 text-xl" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg">{appointment.patient?.name || 'Patient'}</h3>
//                       <p className="text-gray-600">{appointment.patient?.email || 'No email provided'}</p>
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
//                         {canStartCall(appointment) && (
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
//                         onClick={() => handleStartCall(appointment)}
//                         disabled={!canStartCall(appointment) || callStarting}
//                         className={`flex items-center px-4 py-2 rounded-md text-white ${
//                           canStartCall(appointment) 
//                             ? 'bg-blue-600 hover:bg-blue-700' 
//                             : 'bg-gray-300 cursor-not-allowed'
//                         }`}
//                       >
//                         <FaVideo className="mr-2" />
//                         {callStarting && appointment._id === activeVideoCall?._id ? (
//                           <FaSpinner className="animate-spin mr-2" />
//                         ) : 'Start Call'}
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
//                               <>
//                                 <Menu.Item>
//                                   {({ active }) => (
//                                     <button
//                                       onClick={() => confirmCompleteAppointment(appointment._id)}
//                                       className={`${
//                                         active ? 'bg-gray-100' : ''
//                                       } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left`}
//                                     >
//                                       <FaCheckCircle className="mr-2 text-green-500" />
//                                       Mark Complete
//                                     </button>
//                                   )}
//                                 </Menu.Item>
//                                 <Menu.Item>
//                                   {({ active }) => (
//                                     <button
//                                       onClick={() => cancelAppointment(appointment._id)}
//                                       className={`${
//                                         active ? 'bg-gray-100' : ''
//                                       } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left`}
//                                     >
//                                       <FaTimesCircle className="mr-2 text-red-500" />
//                                       Cancel Appointment
//                                     </button>
//                                   )}
//                                 </Menu.Item>
//                               </>
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
//             name: `Dr. ${profileData?.name || 'Doctor'}`,
//             email: profileData?.email || '',
//             isDoctor: true
//           }}
//         />
//       )}

//       {/* Loading Overlay */}
//       {callStarting && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
//             <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
//             <h3 className="text-lg font-medium mb-2">Preparing Video Consultation</h3>
//             <p className="text-gray-600">Connecting with {activeVideoCall?.patient?.name || 'patient'}...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoConsultations;



import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { FaVideo, FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Menu, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';

const VideoConsultations = () => {
  const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [jitsiApi, setJitsiApi] = useState(null);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [callStarting, setCallStarting] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments()
        .then(() => setLoading(false))
        .catch(() => {
          toast.error('Failed to fetch appointments');
          setLoading(false);
        });
    }
  }, [dToken, getAppointments]);

  useEffect(() => {
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [jitsiApi]);

  const canStartCall = (appointment) => {
    if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) return false;
    
    const now = new Date();
    const [day, month, year] = appointment.slotDate.split('_').map(Number);
    const [time, period] = appointment.slotTime.split(' ').map((part) => part.trim());
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
    const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
    
    return now >= startWindow && now <= endWindow;
  };

  const formatDate = (slotDate) => {
    const [day, month, year] = slotDate.split('_').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[month - 1]} ${year}`;
  };

  const getTimeWindowMessage = (appointment) => {
    if (!appointment.slotDate || !appointment.slotTime) return '';
    
    const [day, month, year] = appointment.slotDate.split('_').map(Number);
    const [time, period] = appointment.slotTime.split(' ').map((part) => part.trim());
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
    const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
    
    return `Available from ${startWindow.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })} to ${endWindow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleStartCall = async (appointment) => {
    if (!canStartCall(appointment)) {
      await Swal.fire({
        title: 'Call Not Available',
        text: `The video call is not available yet. ${getTimeWindowMessage(appointment)}`,
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setCallStarting(true);
    setActiveAppointment(appointment);

    try {
      // Load Jitsi Meet API script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => initializeJitsi(appointment);
      script.onerror = () => {
        toast.error('Failed to load video call service');
        setCallStarting(false);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start video call');
      setCallStarting(false);
    }
  };

  const initializeJitsi = (appointment) => {
    try {
      const domain = 'meet.jit.si';
      const roomName = `consultation-${appointment._id}`;
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        userInfo: {
          displayName: `Dr. ${appointment.docData.name}`,
          email: appointment.docData.email,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableSimulcast: false,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      setJitsiApi(api);

      api.addListener('readyToClose', () => {
        handleCallEnd();
      });

      api.addListener('participantJoined', (event) => {
        if (!event.displayName.includes('Dr.')) {
          toast.success('Patient has joined the call');
        }
      });

      api.addListener('participantLeft', (event) => {
        if (!event.displayName.includes('Dr.')) {
          toast.warning('Patient has left the call');
        }
      });

      setCallStarting(false);
    } catch (error) {
      console.error('Jitsi initialization error:', error);
      toast.error('Failed to initialize video call');
      setCallStarting(false);
    }
  };

  const handleCallEnd = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
    }

    setActiveAppointment(null);
    toast.success('Video consultation ended');
    getAppointments();

    if (activeAppointment) {
      Swal.fire({
        title: 'Mark as Completed?',
        text: 'Would you like to mark this appointment as completed?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, mark completed',
        cancelButtonText: 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          completeAppointment(activeAppointment._id);
        }
      });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (appt.cancelled) return false;
    if (appt.consultationType !== 'Video Consultation') return false;
    if (activeTab === 'upcoming') return !appt.isCompleted;
    if (activeTab === 'completed') return appt.isCompleted;
    return true;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.slotDate.split('_').reverse().join('-') + 'T' + a.slotTime);
    const dateB = new Date(b.slotDate.split('_').reverse().join('-') + 'T' + b.slotTime);
    return dateA - dateB;
  });

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      {/* Jitsi Container */}
      {activeAppointment && (
        <div
          id="jitsi-container"
          className="fixed inset-0 z-50 bg-gray-900"
          style={{ display: jitsiApi ? 'block' : 'none' }}
        />
      )}

      {/* Loading Overlay */}
      {callStarting && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <FaSpinner className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-800">Starting video call...</h3>
            <p className="text-sm text-gray-600 mt-2">
              Connecting to {activeAppointment?.userData?.name}'s consultation
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past video consultations</p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
          <FaVideo className="text-blue-600" />
          <span className="text-sm font-medium text-gray-600">
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'consultation' : 'consultations'}
          </span>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            {activeTab === 'upcoming' ? 'No upcoming video consultations' : 'No completed consultations'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'upcoming'
              ? 'Your scheduled video consultations will appear here'
              : 'Completed consultations will appear here'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedAppointments.map((item, index) => (
              <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {item.userData?.image ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                        src={item.userData.image}
                        alt={item.userData?.name || 'Patient'}
                        onError={(e) => (e.target.src = '/default-patient.png')}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FaUserCircle className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-lg font-semibold text-gray-800 truncate">{item.userData?.name || 'Patient'}</h4>
                      <p className="text-sm text-gray-500 truncate">{item.userData?.email || 'No email provided'}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.isCompleted ? 'Completed' : 'Upcoming'}
                        </span>
                        {!item.isCompleted && canStartCall(item) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            <FaClock className="mr-1" /> Active Now
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
                    <FaCalendarAlt className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{formatDate(item.slotDate)}</p>
                      <p className="text-sm text-gray-500 whitespace-nowrap">{item.slotTime}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {item.isCompleted ? (
                      <button
                        disabled
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md cursor-default flex items-center gap-1"
                      >
                        <FaCheckCircle /> Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartCall(item)}
                        className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md gap-2 ${
                          canStartCall(item)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!canStartCall(item)}
                      >
                        <FaVideo /> Start
                      </button>
                    )}

                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <BsThreeDotsVertical />
                      </Menu.Button>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            {!item.isCompleted && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => completeAppointment(item._id)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Mark as completed
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  } block w-full text-left px-4 py-2 text-sm`}
                                >
                                  View details
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoConsultations;
// // // src/pages/doctor/VideoConsultations.jsx
// // import React, { useContext, useEffect, useState } from 'react';
// // import { DoctorContext } from '../../context/DoctorContext';
// // import { toast } from 'react-toastify';
// // import { FaVideo, FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';
// // import { BsThreeDotsVertical } from 'react-icons/bs';
// // import { Menu, Transition } from '@headlessui/react';
// // import Swal from 'sweetalert2';

// // const VideoConsultations = () => {
// //   const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('upcoming');
// //   const [jitsiApi, setJitsiApi] = useState(null);
// //   const [activeAppointment, setActiveAppointment] = useState(null);
// //   const [callStarting, setCallStarting] = useState(false);

// //   useEffect(() => {
// //     if (dToken) {
// //       getAppointments()
// //         .then(() => setLoading(false))
// //         .catch(() => {
// //           toast.error('Failed to fetch appointments');
// //           setLoading(false);
// //         });
// //     }
// //   }, [dToken, getAppointments]);

// //   useEffect(() => {
// //     return () => {
// //       if (jitsiApi) {
// //         jitsiApi.dispose();
// //       }
// //     };
// //   }, [jitsiApi]);

// //   const canStartCall = (appointment) => {
// //     if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) return false;
    
// //     const now = new Date();
// //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //     const [time, period] = appointment.slotTime.split(' ').map((part) => part.trim());
// //     let [hours, minutes] = time.split(':').map(Number);
    
// //     if (period === 'PM' && hours !== 12) hours += 12;
// //     if (period === 'AM' && hours === 12) hours = 0;
    
// //     const appointmentDate = new Date(year, month - 1, day, hours, minutes);
// //     const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
// //     const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
    
// //     return now >= startWindow && now <= endWindow;
// //   };

// //   const formatDate = (slotDate) => {
// //     const [day, month, year] = slotDate.split('_').map(Number);
// //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// //     return `${day} ${months[month - 1]} ${year}`;
// //   };

// //   const getTimeWindowMessage = (appointment) => {
// //     if (!appointment.slotDate || !appointment.slotTime) return '';
    
// //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //     const [time, period] = appointment.slotTime.split(' ').map((part) => part.trim());
// //     let [hours, minutes] = time.split(':').map(Number);
    
// //     if (period === 'PM' && hours !== 12) hours += 12;
// //     if (period === 'AM' && hours === 12) hours = 0;
    
// //     const appointmentDate = new Date(year, month - 1, day, hours, minutes);
// //     const startWindow = new Date(appointmentDate.getTime() - 5 * 60000);
// //     const endWindow = new Date(appointmentDate.getTime() + 10 * 60000);
    
// //     return `Available from ${startWindow.toLocaleTimeString([], {
// //       hour: '2-digit',
// //       minute: '2-digit',
// //     })} to ${endWindow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
// //   };

// //   const handleStartCall = async (appointment) => {
// //     if (!canStartCall(appointment)) {
// //       await Swal.fire({
// //         title: 'Call Not Available',
// //         text: `The video call is not available yet. ${getTimeWindowMessage(appointment)}`,
// //         icon: 'info',
// //         confirmButtonText: 'OK',
// //         confirmButtonColor: '#3085d6',
// //       });
// //       return;
// //     }

// //     setCallStarting(true);
// //     setActiveAppointment(appointment);

// //     try {
// //       // Load Jitsi Meet API script
// //       const script = document.createElement('script');
// //       script.src = 'https://meet.jit.si/external_api.js';
// //       script.async = true;
// //       script.onload = () => initializeJitsi(appointment);
// //       script.onerror = () => {
// //         toast.error('Failed to load video call service');
// //         setCallStarting(false);
// //       };
// //       document.body.appendChild(script);
// //     } catch (error) {
// //       console.error('Error starting call:', error);
// //       toast.error('Failed to start video call');
// //       setCallStarting(false);
// //     }
// //   };

// //   const initializeJitsi = (appointment) => {
// //     try {
// //       const domain = 'meet.jit.si';
// //       const roomName = `consultation-${appointment._id}`;
      
// //       const options = {
// //         roomName: roomName,
// //         width: '100%',
// //         height: '100%',
// //         parentNode: document.querySelector('#jitsi-container'),
// //         userInfo: {
// //           displayName: `Dr. ${appointment.docData.name}`,
// //           email: appointment.docData.email,
// //         },
// //         configOverwrite: {
// //           startWithAudioMuted: false,
// //           startWithVideoMuted: false,
// //           enableWelcomePage: false,
// //           prejoinPageEnabled: false,
// //           disableSimulcast: false,
// //         },
// //         interfaceConfigOverwrite: {
// //           DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
// //           SHOW_JITSI_WATERMARK: false,
// //           SHOW_WATERMARK_FOR_GUESTS: false,
// //           MOBILE_APP_PROMO: false,
// //           HIDE_INVITE_MORE_HEADER: true,
// //           TOOLBAR_BUTTONS: [
// //             'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
// //             'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
// //             'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
// //             'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
// //             'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
// //             'security'
// //           ],
// //         },
// //       };

// //       const api = new window.JitsiMeetExternalAPI(domain, options);
// //       setJitsiApi(api);

// //       api.addListener('readyToClose', () => {
// //         handleCallEnd();
// //       });

// //       api.addListener('participantJoined', (event) => {
// //         if (!event.displayName.includes('Dr.')) {
// //           toast.success('Patient has joined the call');
// //         }
// //       });

// //       api.addListener('participantLeft', (event) => {
// //         if (!event.displayName.includes('Dr.')) {
// //           toast.warning('Patient has left the call');
// //         }
// //       });

// //       setCallStarting(false);
// //     } catch (error) {
// //       console.error('Jitsi initialization error:', error);
// //       toast.error('Failed to initialize video call');
// //       setCallStarting(false);
// //     }
// //   };

// //   const handleCallEnd = () => {
// //     if (jitsiApi) {
// //       jitsiApi.dispose();
// //       setJitsiApi(null);
// //     }

// //     setActiveAppointment(null);
// //     toast.success('Video consultation ended');
// //     getAppointments();

// //     if (activeAppointment) {
// //       Swal.fire({
// //         title: 'Mark as Completed?',
// //         text: 'Would you like to mark this appointment as completed?',
// //         icon: 'question',
// //         showCancelButton: true,
// //         confirmButtonText: 'Yes, mark completed',
// //         cancelButtonText: 'No',
// //         confirmButtonColor: '#3085d6',
// //         cancelButtonColor: '#d33',
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           completeAppointment(activeAppointment._id);
// //         }
// //       });
// //     }
// //   };

// //   const filteredAppointments = appointments.filter((appt) => {
// //     if (appt.cancelled) return false;
// //     if (appt.consultationType !== 'Video Consultation') return false;
// //     if (activeTab === 'upcoming') return !appt.isCompleted;
// //     if (activeTab === 'completed') return appt.isCompleted;
// //     return true;
// //   });

// //   const sortedAppointments = [...filteredAppointments].sort((a, b) => {
// //     const dateA = new Date(a.slotDate.split('_').reverse().join('-') + 'T' + a.slotTime);
// //     const dateB = new Date(b.slotDate.split('_').reverse().join('-') + 'T' + b.slotTime);
// //     return dateA - dateB;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="w-full max-w-6xl mx-auto p-5">
// //         <div className="animate-pulse space-y-4">
// //           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
// //           <div className="h-96 bg-gray-200 rounded"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full max-w-6xl mx-auto p-5">
// //       {/* Jitsi Container */}
// //       {activeAppointment && (
// //         <div
// //           id="jitsi-container"
// //           className="fixed inset-0 z-50 bg-gray-900"
// //           style={{ display: jitsiApi ? 'block' : 'none' }}
// //         />
// //       )}

// //       {/* Loading Overlay */}
// //       {callStarting && (
// //         <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
// //           <div className="bg-white p-6 rounded-lg max-w-md text-center">
// //             <FaSpinner className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
// //             <h3 className="text-lg font-medium text-gray-800">Starting video call...</h3>
// //             <p className="text-sm text-gray-600 mt-2">
// //               Connecting to {activeAppointment?.userData?.name}'s consultation
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
// //           <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past video consultations</p>
// //         </div>

// //         <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
// //           <FaVideo className="text-blue-600" />
// //           <span className="text-sm font-medium text-gray-600">
// //             {filteredAppointments.length} {filteredAppointments.length === 1 ? 'consultation' : 'consultations'}
// //           </span>
// //         </div>
// //       </div>

// //       <div className="flex border-b border-gray-200 mb-6">
// //         <button
// //           onClick={() => setActiveTab('upcoming')}
// //           className={`px-4 py-2 text-sm font-medium ${
// //             activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
// //           }`}
// //         >
// //           Upcoming
// //         </button>
// //         <button
// //           onClick={() => setActiveTab('completed')}
// //           className={`px-4 py-2 text-sm font-medium ${
// //             activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
// //           }`}
// //         >
// //           Completed
// //         </button>
// //       </div>

// //       {sortedAppointments.length === 0 ? (
// //         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// //           <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// //           <h3 className="text-lg font-medium text-gray-700">
// //             {activeTab === 'upcoming' ? 'No upcoming video consultations' : 'No completed consultations'}
// //           </h3>
// //           <p className="mt-1 text-sm text-gray-500">
// //             {activeTab === 'upcoming'
// //               ? 'Your scheduled video consultations will appear here'
// //               : 'Completed consultations will appear here'}
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="bg-white shadow rounded-lg overflow-hidden">
// //           <ul className="divide-y divide-gray-200">
// //             {sortedAppointments.map((item, index) => (
// //               <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                   <div className="flex items-center gap-4 min-w-0 flex-1">
// //                     {item.userData?.image ? (
// //                       <img
// //                         className="h-12 w-12 rounded-full object-cover flex-shrink-0"
// //                         src={item.userData.image}
// //                         alt={item.userData?.name || 'Patient'}
// //                         onError={(e) => (e.target.src = '/default-patient.png')}
// //                       />
// //                     ) : (
// //                       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
// //                         <FaUserCircle className="h-6 w-6 text-gray-500" />
// //                       </div>
// //                     )}
// //                     <div className="min-w-0">
// //                       <h4 className="text-lg font-semibold text-gray-800 truncate">{item.userData?.name || 'Patient'}</h4>
// //                       <p className="text-sm text-gray-500 truncate">{item.userData?.email || 'No email provided'}</p>
// //                       <div className="mt-1 flex items-center gap-2">
// //                         <span
// //                           className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
// //                             item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
// //                           }`}
// //                         >
// //                           {item.isCompleted ? 'Completed' : 'Upcoming'}
// //                         </span>
// //                         {!item.isCompleted && canStartCall(item) && (
// //                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
// //                             <FaClock className="mr-1" /> Active Now
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
// //                     <FaCalendarAlt className="h-4 w-4 text-gray-500 flex-shrink-0" />
// //                     <div className="ml-2">
// //                       <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{formatDate(item.slotDate)}</p>
// //                       <p className="text-sm text-gray-500 whitespace-nowrap">{item.slotTime}</p>
// //                     </div>
// //                   </div>

// //                   <div className="flex-shrink-0 flex items-center gap-2">
// //                     {item.isCompleted ? (
// //                       <button
// //                         disabled
// //                         className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md cursor-default flex items-center gap-1"
// //                       >
// //                         <FaCheckCircle /> Completed
// //                       </button>
// //                     ) : (
// //                       <button
// //                         onClick={() => handleStartCall(item)}
// //                         className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md gap-2 ${
// //                           canStartCall(item)
// //                             ? 'bg-blue-600 text-white hover:bg-blue-700'
// //                             : 'bg-gray-200 text-gray-500 cursor-not-allowed'
// //                         }`}
// //                         disabled={!canStartCall(item)}
// //                       >
// //                         <FaVideo /> Start
// //                       </button>
// //                     )}

// //                     <Menu as="div" className="relative inline-block text-left">
// //                       <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
// //                         <BsThreeDotsVertical />
// //                       </Menu.Button>
// //                       <Transition
// //                         enter="transition ease-out duration-100"
// //                         enterFrom="transform opacity-0 scale-95"
// //                         enterTo="transform opacity-100 scale-100"
// //                         leave="transition ease-in duration-75"
// //                         leaveFrom="transform opacity-100 scale-100"
// //                         leaveTo="transform opacity-0 scale-95"
// //                       >
// //                         <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
// //                           <div className="py-1">
// //                             {!item.isCompleted && (
// //                               <Menu.Item>
// //                                 {({ active }) => (
// //                                   <button
// //                                     onClick={() => completeAppointment(item._id)}
// //                                     className={`${
// //                                       active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                     } block w-full text-left px-4 py-2 text-sm`}
// //                                   >
// //                                     Mark as completed
// //                                   </button>
// //                                 )}
// //                               </Menu.Item>
// //                             )}
// //                             <Menu.Item>
// //                               {({ active }) => (
// //                                 <button
// //                                   className={`${
// //                                     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                   } block w-full text-left px-4 py-2 text-sm`}
// //                                 >
// //                                   View details
// //                                 </button>
// //                               )}
// //                             </Menu.Item>
// //                           </div>
// //                         </Menu.Items>
// //                       </Transition>
// //                     </Menu>
// //                   </div>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default VideoConsultations;




// ///video calling

// // import React, { useContext, useEffect, useState } from 'react';
// // import { DoctorContext } from '../../context/DoctorContext';
// // import { toast } from 'react-toastify';
// // import { FaVideo, FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
// // import { BsThreeDotsVertical } from 'react-icons/bs';
// // import { Menu, Transition } from '@headlessui/react';
// // import axios from 'axios';
// // import Swal from 'sweetalert2';

// // const VideoConsultations = () => {
// //   const { dToken, appointments, getAppointments, completeAppointment, backendUrl } = useContext(DoctorContext);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('upcoming');
// //   const [jitsiApi, setJitsiApi] = useState(null);
// //   const [activeAppointment, setActiveAppointment] = useState(null);

// //   // Fetch appointments on mount
// //   useEffect(() => {
// //     if (dToken) {
// //       getAppointments()
// //         .then(() => setLoading(false))
// //         .catch(() => {
// //           toast.error('Failed to fetch appointments');
// //           setLoading(false);
// //         });
// //     }
// //   }, [dToken, getAppointments]);

// //   // Clean up Jitsi when component unmounts
// //   useEffect(() => {
// //     return () => {
// //       if (jitsiApi) {
// //         jitsiApi.dispose();
// //       }
// //     };
// //   }, [jitsiApi]);

// //   // Check if the video call can be started (within ±5 minutes of scheduled time)
// //   const canStartCall = (appointment) => {
// //     if (!appointment.slotDate || !appointment.slotTime || appointment.isCompleted) return false;
    
// //     const now = new Date();
// //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //     const [time, period] = appointment.slotTime.split(' ').map((part) => part.trim());
// //     let [hours, minutes] = time.split(':').map(Number);
    
// //     if (period === 'PM' && hours !== 12) hours += 12;
// //     if (period === 'AM' && hours === 12) hours = 0;
    
// //     const appointmentDate = new Date(year, month - 1, day, hours, minutes);
// //     const startWindow = new Date(appointmentDate.getTime() - 5 * 60000); // 5 minutes before
// //     const endWindow = new Date(appointmentDate.getTime() + 10 * 60000); // 10 minutes after
    
// //     return now >= startWindow && now <= endWindow;
// //   };

// //   // Format the slotDate (e.g., 15 Oct 2025)
// //   const formatDate = (slotDate) => {
// //     const [day, month, year] = slotDate.split('_').map(Number);
// //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// //     return `${day} ${months[month - 1]} ${year}`;
// //   };

// //   // Handle starting the video call with Jitsi
// //   const handleStartCall = async (appointment) => {
// //     if (!canStartCall(appointment)) {
// //       await Swal.fire({
// //         title: 'Call Not Available',
// //         text: 'The video call is only available 5 minutes before and 10 minutes after the scheduled time',
// //         icon: 'info',
// //         confirmButtonText: 'OK',
// //         confirmButtonColor: '#3085d6',
// //       });
// //       return;
// //     }

// //     try {
// //       // Generate a unique room name based on appointment ID
// //       const roomName = `consultation-${appointment._id}`;
      
// //       // Dispose any existing Jitsi instance
// //       if (jitsiApi) {
// //         jitsiApi.dispose();
// //       }

// //       // Load Jitsi Meet API script dynamically
// //       const script = document.createElement('script');
// //       script.src = 'https://meet.jit.si/external_api.js';
// //       script.async = true;
// //       script.onload = () => initializeJitsi(roomName, appointment);
// //       document.body.appendChild(script);

// //       setActiveAppointment(appointment);
// //     } catch (error) {
// //       console.error('Error starting video call:', error);
// //       toast.error('Failed to start video call. Please try again.');
// //     }
// //   };

// //   // Initialize Jitsi Meet
// //   const initializeJitsi = (roomName, appointment) => {
// //     const domain = 'meet.jit.si';
// //     const options = {
// //       roomName: roomName,
// //       width: '100%',
// //       height: '100%',
// //       parentNode: document.querySelector('#jitsi-container'),
// //       userInfo: {
// //         displayName: `Dr. ${appointment.docData.name}`,
// //         email: appointment.docData.email,
// //       },
// //       configOverwrite: {
// //         startWithAudioMuted: false,
// //         startWithVideoMuted: false,
// //         enableWelcomePage: false,
// //       },
// //       interfaceConfigOverwrite: {
// //         SHOW_JITSI_WATERMARK: false,
// //         SHOW_WATERMARK_FOR_GUESTS: false,
// //         DEFAULT_BACKGROUND: '#f0f2f5',
// //         TOOLBAR_BUTTONS: [
// //           'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
// //           'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
// //           'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
// //           'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
// //           'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
// //           'security'
// //         ],
// //       },
// //     };

// //     const api = new window.JitsiMeetExternalAPI(domain, options);
// //     setJitsiApi(api);

// //     api.addListener('readyToClose', () => {
// //       handleCallEnd();
// //       api.dispose();
// //     });
// //   };

// //   // Handle call end
// //   const handleCallEnd = () => {
// //     if (jitsiApi) {
// //       jitsiApi.dispose();
// //       setJitsiApi(null);
// //     }

// //     setActiveAppointment(null);
// //     toast.success('Video consultation ended');
// //     getAppointments(); // Refresh appointments

// //     // Prompt to mark as completed
// //     if (activeAppointment) {
// //       Swal.fire({
// //         title: 'Mark as Completed?',
// //         text: 'Would you like to mark this appointment as completed?',
// //         icon: 'question',
// //         showCancelButton: true,
// //         confirmButtonText: 'Yes, mark completed',
// //         cancelButtonText: 'No',
// //         confirmButtonColor: '#3085d6',
// //         cancelButtonColor: '#d33',
// //       }).then((result) => {
// //         if (result.isConfirmed) {
// //           completeAppointment(activeAppointment._id);
// //         }
// //       });
// //     }
// //   };

// //   const filteredAppointments = appointments.filter((appt) => {
// //     if (appt.cancelled) return false;
// //     if (appt.consultationType !== 'Video Consultation') return false;

// //     if (activeTab === 'upcoming') return !appt.isCompleted;
// //     if (activeTab === 'completed') return appt.isCompleted;

// //     return true;
// //   });

// //   const sortedAppointments = [...filteredAppointments].sort((a, b) => {
// //     const dateA = new Date(a.slotDate.split('_').reverse().join('-') + 'T' + a.slotTime);
// //     const dateB = new Date(b.slotDate.split('_').reverse().join('-') + 'T' + b.slotTime);
// //     return dateA - dateB;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="w-full max-w-6xl mx-auto p-5">
// //         <div className="animate-pulse space-y-4">
// //           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
// //           <div className="h-96 bg-gray-200 rounded"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full max-w-6xl mx-auto p-5">
// //       {/* Jitsi Container (hidden until call starts) */}
// //       {activeAppointment && (
// //         <div
// //           id="jitsi-container"
// //           className="fixed inset-0 z-50 bg-white"
// //           style={{ display: jitsiApi ? 'block' : 'none' }}
// //         />
// //       )}

// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
// //           <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past video consultations</p>
// //         </div>

// //         <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
// //           <FaVideo className="text-blue-600" />
// //           <span className="text-sm font-medium text-gray-600">
// //             {filteredAppointments.length} {filteredAppointments.length === 1 ? 'consultation' : 'consultations'}
// //           </span>
// //         </div>
// //       </div>

// //       <div className="flex border-b border-gray-200 mb-6">
// //         <button
// //           onClick={() => setActiveTab('upcoming')}
// //           className={`px-4 py-2 text-sm font-medium ${
// //             activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
// //           }`}
// //         >
// //           Upcoming
// //         </button>
// //         <button
// //           onClick={() => setActiveTab('completed')}
// //           className={`px-4 py-2 text-sm font-medium ${
// //             activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
// //           }`}
// //         >
// //           Completed
// //         </button>
// //       </div>

// //       {sortedAppointments.length === 0 ? (
// //         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// //           <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// //           <h3 className="text-lg font-medium text-gray-700">
// //             {activeTab === 'upcoming' ? 'No upcoming video consultations' : 'No completed consultations'}
// //           </h3>
// //           <p className="mt-1 text-sm text-gray-500">
// //             {activeTab === 'upcoming'
// //               ? 'Your scheduled video consultations will appear here'
// //               : 'Completed consultations will appear here'}
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="bg-white shadow rounded-lg overflow-hidden">
// //           <ul className="divide-y divide-gray-200">
// //             {sortedAppointments.map((item, index) => (
// //               <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                   <div className="flex items-center gap-4 min-w-0 flex-1">
// //                     {item.userData?.image ? (
// //                       <img
// //                         className="h-12 w-12 rounded-full object-cover flex-shrink-0"
// //                         src={item.userData.image}
// //                         alt={item.userData?.name || 'Patient'}
// //                         onError={(e) => (e.target.src = '/default-patient.png')}
// //                       />
// //                     ) : (
// //                       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
// //                         <FaUserCircle className="h-6 w-6 text-gray-500" />
// //                       </div>
// //                     )}
// //                     <div className="min-w-0">
// //                       <h4 className="text-lg font-semibold text-gray-800 truncate">{item.userData?.name || 'Patient'}</h4>
// //                       <p className="text-sm text-gray-500 truncate">{item.userData?.email || 'No email provided'}</p>
// //                       <div className="mt-1 flex items-center gap-2">
// //                         <span
// //                           className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
// //                             item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
// //                           }`}
// //                         >
// //                           {item.isCompleted ? 'Completed' : 'Upcoming'}
// //                         </span>
// //                         {!item.isCompleted && canStartCall(item) && (
// //                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
// //                             <FaClock className="mr-1" /> Active Now
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
// //                     <FaCalendarAlt className="h-4 w-4 text-gray-500 flex-shrink-0" />
// //                     <div className="ml-2">
// //                       <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{formatDate(item.slotDate)}</p>
// //                       <p className="text-sm text-gray-500 whitespace-nowrap">{item.slotTime}</p>
// //                     </div>
// //                   </div>

// //                   <div className="flex-shrink-0 flex items-center gap-2">
// //                     {item.isCompleted ? (
// //                       <button
// //                         disabled
// //                         className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md cursor-default flex items-center gap-1"
// //                       >
// //                         <FaCheckCircle /> Completed
// //                       </button>
// //                     ) : (
// //                       <button
// //                         onClick={() => handleStartCall(item)}
// //                         className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md gap-2 ${
// //                           canStartCall(item)
// //                             ? 'bg-blue-600 text-white hover:bg-blue-700'
// //                             : 'bg-gray-200 text-gray-500 cursor-not-allowed'
// //                         }`}
// //                         disabled={!canStartCall(item)}
// //                       >
// //                         <FaVideo /> Start
// //                       </button>
// //                     )}

// //                     <Menu as="div" className="relative inline-block text-left">
// //                       <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
// //                         <BsThreeDotsVertical />
// //                       </Menu.Button>
// //                       <Transition
// //                         enter="transition ease-out duration-100"
// //                         enterFrom="transform opacity-0 scale-95"
// //                         enterTo="transform opacity-100 scale-100"
// //                         leave="transition ease-in duration-75"
// //                         leaveFrom="transform opacity-100 scale-100"
// //                         leaveTo="transform opacity-0 scale-95"
// //                       >
// //                         <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
// //                           <div className="py-1">
// //                             {!item.isCompleted && (
// //                               <Menu.Item>
// //                                 {({ active }) => (
// //                                   <button
// //                                     onClick={() => completeAppointment(item._id)}
// //                                     className={`${
// //                                       active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                     } block w-full text-left px-4 py-2 text-sm`}
// //                                   >
// //                                     Mark as completed
// //                                   </button>
// //                                 )}
// //                               </Menu.Item>
// //                             )}
// //                             <Menu.Item>
// //                               {({ active }) => (
// //                                 <button
// //                                   className={`${
// //                                     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                   } block w-full text-left px-4 py-2 text-sm`}
// //                                 >
// //                                   View details
// //                                 </button>
// //                               )}
// //                             </Menu.Item>
// //                           </div>
// //                         </Menu.Items>
// //                       </Transition>
// //                     </Menu>
// //                   </div>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default VideoConsultations;


// // import React, { useContext, useEffect, useState } from 'react';
// // import { DoctorContext } from '../../context/DoctorContext';
// // import { toast } from 'react-toastify';
// // import { FaVideo, FaUserCircle, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
// // import { BsThreeDotsVertical } from 'react-icons/bs';
// // import { Menu, Transition } from '@headlessui/react';

// // const VideoConsultations = () => {
// //   const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState('upcoming');

// //   // Fetch appointments if token is available
// //   useEffect(() => {
// //     if (dToken) {
// //       const fetchData = async () => {
// //         try {
// //           await getAppointments();
// //         } catch (error) {
// //           toast.error('Failed to fetch appointments');
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
// //       fetchData();
// //     }
// //   }, [dToken]);

// //   // Check if call can be started based on the appointment window
// //   const canStartCall = (appointment) => {
// //     if (appointment.isCompleted) return false;

// //     const now = new Date();
// //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //     const [time, period] = appointment.slotTime.split(' ');
// //     let [hours, minutes] = time.split(':').map(Number);

// //     // Convert to 24-hour format
// //     if (period === 'PM' && hours !== 12) hours += 12;
// //     if (period === 'AM' && hours === 12) hours = 0;

// //     const appointmentTime = new Date(year, month - 1, day, hours, minutes);
// //     const startWindow = new Date(appointmentTime.getTime() - 15 * 60000); // 15 mins before
// //     const endWindow = new Date(appointmentTime.getTime() + 30 * 60000); // 30 mins after

// //     return now >= startWindow && now <= endWindow;
// //   };

// //   // Format date for display
// //   const formatDate = (slotDate) => {
// //     const [day, month, year] = slotDate.split('_').map(Number);
// //     const date = new Date(year, month - 1, day);
// //     return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
// //   };

// //   // Filter appointments
// //   const filteredAppointments = appointments.filter(appt => {
// //     if (appt.cancelled) return false;
// //     if (appt.consultationType !== 'Video Consultation') return false;
    
// //     if (activeTab === 'upcoming') return !appt.isCompleted;
// //     if (activeTab === 'completed') return appt.isCompleted;
    
// //     return true;
// //   });

// //   // Sort appointments by date and time (soonest first)
// //   const sortedAppointments = [...filteredAppointments].sort((a, b) => {
// //     const dateA = new Date(a.slotDate.split('_').reverse().join('-') + 'T' + a.slotTime);
// //     const dateB = new Date(b.slotDate.split('_').reverse().join('-') + 'T' + b.slotTime);
// //     return dateA - dateB;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="w-full max-w-6xl mx-auto p-5">
// //         <div className="animate-pulse space-y-4">
// //           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
// //           <div className="h-96 bg-gray-100 rounded"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full max-w-6xl mx-auto p-5">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
// //           <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past video consultations</p>
// //         </div>
        
// //         <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
// //           <FaVideo className="text-blue-600" />
// //           <span className="text-sm font-medium text-gray-600">
// //             {filteredAppointments.length} {filteredAppointments.length === 1 ? 'consultation' : 'consultations'}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Tabs */}
// //       <div className="flex border-b border-gray-200 mb-6">
// //         <button
// //           onClick={() => setActiveTab('upcoming')}
// //           className={`px-4 py-2 text-sm font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //         >
// //           Upcoming
// //         </button>
// //         <button
// //           onClick={() => setActiveTab('completed')}
// //           className={`px-4 py-2 text-sm font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
// //         >
// //           Completed
// //         </button>
// //       </div>

// //       {/* No appointments */}
// //       {sortedAppointments.length === 0 ? (
// //         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// //           <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// //           <h3 className="text-lg font-medium text-gray-700">
// //             {activeTab === 'upcoming' ? 'No upcoming video consultations' : 'No completed consultations'}
// //           </h3>
// //           <p className="mt-1 text-sm text-gray-500">
// //             {activeTab === 'upcoming' 
// //               ? 'Your scheduled video consultations will appear here' 
// //               : 'Completed consultations will appear here'}
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="bg-white shadow rounded-lg overflow-hidden">
// //           <ul className="divide-y divide-gray-200">
// //             {sortedAppointments.map((item, index) => (
// //               <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                   {/* Patient Info */}
// //                   <div className="flex items-center gap-4 min-w-0 flex-1">
// //                     {item.userData?.image ? (
// //                       <img 
// //                         className="h-12 w-12 rounded-full object-cover flex-shrink-0" 
// //                         src={item.userData.image} 
// //                         alt={item.userData?.name || 'Patient'} 
// //                       />
// //                     ) : (
// //                       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
// //                         <FaUserCircle className="h-6 w-6 text-gray-500" />
// //                       </div>
// //                     )}
// //                     <div className="min-w-0">
// //                       <h4 className="text-lg font-semibold text-gray-800 truncate">
// //                         {item.userData?.name || 'Patient'}
// //                       </h4>
// //                       <p className="text-sm text-gray-500 truncate">
// //                         {item.userData?.email || 'No email provided'}
// //                       </p>
// //                       <div className="mt-1 flex items-center gap-2">
// //                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
// //                           item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
// //                         }`}>
// //                           {item.isCompleted ? 'Completed' : 'Upcoming'}
// //                         </span>
// //                         {!item.isCompleted && canStartCall(item) && (
// //                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
// //                             <FaClock className="mr-1" /> Active Now
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Appointment Time */}
// //                   <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
// //                     <FaCalendarAlt className="h-4 w-4 text-gray-500 flex-shrink-0" />
// //                     <div className="ml-2">
// //                       <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
// //                         {formatDate(item.slotDate)}
// //                       </p>
// //                       <p className="text-sm text-gray-500 whitespace-nowrap">
// //                         {item.slotTime}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="flex-shrink-0 flex items-center gap-2">
// //                     {item.isCompleted ? (
// //                       <button 
// //                         disabled
// //                         className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md cursor-default flex items-center gap-1"
// //                       >
// //                         <FaCheckCircle /> Completed
// //                       </button>
// //                     ) : (
// //                       <button
// //                         onClick={() => {
// //                           if (!canStartCall(item)) {
// //                             toast.error('Consultation can only be started 15 minutes before until 30 minutes after the scheduled time');
// //                             return;
// //                           }
// //                           // Here you would integrate with your video calling solution
// //                           toast.info('Initiating video call...');
// //                         }}
// //                         className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md gap-2 ${
// //                           canStartCall(item) 
// //                             ? 'bg-blue-600 text-white hover:bg-blue-700' 
// //                             : 'bg-gray-200 text-gray-500 cursor-not-allowed'
// //                         }`}
// //                       >
// //                         <FaVideo /> Start
// //                       </button>
// //                     )}
                    
// //                     <Menu as="div" className="relative inline-block text-left">
// //                       <Menu.Button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
// //                         <BsThreeDotsVertical />
// //                       </Menu.Button>
// //                       <Transition
// //                         enter="transition ease-out duration-100"
// //                         enterFrom="transform opacity-0 scale-95"
// //                         enterTo="transform opacity-100 scale-100"
// //                         leave="transition ease-in duration-75"
// //                         leaveFrom="transform opacity-100 scale-100"
// //                         leaveTo="transform opacity-0 scale-95"
// //                       >
// //                         <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
// //                           <div className="py-1">
// //                             {!item.isCompleted && (
// //                               <Menu.Item>
// //                                 {({ active }) => (
// //                                   <button
// //                                     onClick={() => completeAppointment(item._id)}
// //                                     className={`${
// //                                       active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                     } block w-full text-left px-4 py-2 text-sm`}
// //                                   >
// //                                     Mark as completed
// //                                   </button>
// //                                 )}
// //                               </Menu.Item>
// //                             )}
// //                             <Menu.Item>
// //                               {({ active }) => (
// //                                 <button
// //                                   className={`${
// //                                     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
// //                                   } block w-full text-left px-4 py-2 text-sm`}
// //                                 >
// //                                   View details
// //                                 </button>
// //                               )}
// //                             </Menu.Item>
// //                           </div>
// //                         </Menu.Items>
// //                       </Transition>
// //                     </Menu>
// //                   </div>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default VideoConsultations;








// // import React, { useContext, useEffect } from 'react';
// // import { DoctorContext } from '../../context/DoctorContext';
// // import { toast } from 'react-toastify';

// // const VideoConsultations = () => {
// //   const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);

// //   // Fetch appointments if token is available
// //   useEffect(() => {
// //     if (dToken) {
// //       getAppointments();
// //     }
// //   }, [dToken]);

// //   // Check if call can be started based on the appointment window
// //   const canStartCall = (appointment) => {
// //     if (appointment.isCompleted) return false; // Check if appointment is already completed

// //     const now = new Date();
// //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// //     const [time, period] = appointment.slotTime.split(' ');
// //     let [hours, minutes] = time.split(':').map(Number);

// //     if (period === 'PM' && hours !== 12) hours += 12;
// //     if (period === 'AM' && hours === 12) hours = 0;

// //     const appointmentTime = new Date(year, month - 1, day, hours, minutes);
// //     const startWindow = new Date(appointmentTime.getTime() - 15 * 60000); // 15 mins before
// //     const endWindow = new Date(appointmentTime.getTime() + 30 * 60000); // 30 mins after

// //     return now >= startWindow && now <= endWindow;
// //   };

// //   // Function to handle appointment completion
// //   const handleCompleteAppointment = (appointment) => {
// //     completeAppointment(appointment._id);
// //     toast.success('Appointment marked as completed');
// //   };

// //   // Filter appointments to show only video consultations and exclude canceled ones
// //   const videoAppointments = appointments.filter(
// //     (appt) => appt.consultationType === 'Video Consultation' && !appt.cancelled
// //   );

// //   // Render component
// //   return (
// //     <div className="w-full max-w-6xl mx-auto p-5">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
// //         <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
// //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
// //           </svg>
// //           <span className="text-sm font-medium text-gray-600">
// //             {videoAppointments.length} {videoAppointments.length === 1 ? 'consultation' : 'consultations'}
// //           </span>
// //         </div>
// //       </div>

// //       {/* No upcoming consultations */}
// //       {videoAppointments.length === 0 ? (
// //         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// //           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
// //           </svg>
// //           <h3 className="mt-3 text-lg font-medium text-gray-700">No upcoming video consultations</h3>
// //           <p className="mt-1 text-sm text-gray-500">Your scheduled video consultations will appear here</p>
// //         </div>
// //       ) : (
// //         <div className="bg-white shadow rounded-lg overflow-hidden">
// //           <ul className="divide-y divide-gray-200">
// //             {videoAppointments.map((item, index) => (
// //               <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                   {/* Patient Info */}
// //                   <div className="flex items-center gap-4 min-w-0">
// //                     {item.userData?.image ? (
// //                       <img className="h-12 w-12 rounded-full object-cover flex-shrink-0" src={item.userData.image} alt="Patient" />
// //                     ) : (
// //                       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //                         </svg>
// //                       </div>
// //                     )}
// //                     <div className="min-w-0">
// //                       <h4 className="text-lg font-semibold text-gray-800 truncate">{item.userData?.name || 'Patient'}</h4>
// //                       <p className="text-sm text-gray-500 truncate">{item.userData?.email}</p>
// //                       <div className="mt-1 flex flex-wrap gap-2">
// //                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
// //                           item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
// //                         }`}>
// //                           {item.isCompleted ? 'Completed' : 'Upcoming'}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Appointment Time */}
// //                   <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
// //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// //                     </svg>
// //                     <div className="ml-2">
// //                       <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
// //                         {item.slotDate.replaceAll('_', '/')}
// //                       </p>
// //                       <p className="text-sm text-gray-500 whitespace-nowrap">
// //                         {item.slotTime}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="flex-shrink-0">
// //                     {item.isCompleted ? (
// //                       <button 
// //                         disabled
// //                         className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md cursor-default">
// //                         Consultation Completed
// //                       </button>
// //                     ) : (
// //                       <button
// //                         onClick={() => {
// //                           if (!canStartCall(item)) {
// //                             toast.error('You can only start the consultation during the scheduled time window');
// //                             return;
// //                           }
// //                           // Here you would integrate with your video calling solution
// //                           toast.info('Video consultation functionality would be initiated here');
// //                         }}
// //                         className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
// //                           canStartCall(item) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                         }`}>
// //                         Start Consultation
// //                       </button>
// //                     )}
// //                   </div>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };


// // export default VideoConsultations;








// // // import React, { useContext, useEffect, useState } from 'react';
// // // import { DoctorContext } from '../../context/DoctorContext';
// // // import { toast } from 'react-toastify';

// // // const VideoConsultations = () => {
// // //   const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);
// // //   const [activeCall, setActiveCall] = useState(null);
// // //   const [isCallStarting, setIsCallStarting] = useState(false);

// // //   // Fetch appointments if token is available
// // //   useEffect(() => {
// // //     if (dToken) {
// // //       getAppointments();
// // //     }
// // //   }, [dToken]);

// // //   // Load Jitsi script dynamically
// // //   useEffect(() => {
// // //     if (!window.JitsiMeetExternalAPI) {
// // //       const script = document.createElement('script');
// // //       script.src = 'https://meet.jit.si/external_api.js';
// // //       script.async = true;
// // //       document.body.appendChild(script);
// // //     }
// // //   }, []);

// // //   // Function to start video call
// // //   const startVideoCall = (appointment) => {
// // //     if (!appointment.videoRoom) {
// // //       toast.error('This appointment has no video room configured');
// // //       return;
// // //     }
// // //     setIsCallStarting(true);
// // //     setActiveCall(appointment);
// // //   };

// // //   // Function to end video call
// // //   const endVideoCall = () => {
// // //     setActiveCall(null);
// // //     setIsCallStarting(false);
// // //     if (activeCall) {
// // //       completeAppointment(activeCall._id);
// // //     }
// // //   };

// // //   // Check if call can be started based on the appointment window
// // //   const canStartCall = (appointment) => {
// // //     if (appointment.status === 'completed') return false;

// // //     const now = new Date();
// // //     const [day, month, year] = appointment.slotDate.split('_').map(Number);
// // //     const [time, period] = appointment.slotTime.split(' ');
// // //     let [hours, minutes] = time.split(':').map(Number);

// // //     if (period === 'PM' && hours !== 12) hours += 12;
// // //     if (period === 'AM' && hours === 12) hours = 0;

// // //     const appointmentTime = new Date(year, month - 1, day, hours, minutes);
// // //     const startWindow = new Date(appointmentTime.getTime() - 15 * 60000); // 15 mins before
// // //     const endWindow = new Date(appointmentTime.getTime() + 30 * 60000); // 30 mins after

// // //     return now >= startWindow && now <= endWindow;
// // //   };

// // //   // Filter appointments to show only video consultations
// // //   const videoAppointments = appointments.filter((appt) => appt.consultationType === 'Video Consultation');

// // //   // Render component
// // //   return (
// // //     <div className="w-full max-w-6xl mx-auto p-5">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h2 className="text-2xl font-bold text-gray-800">Video Consultations</h2>
// // //         <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
// // //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
// // //           </svg>
// // //           <span className="text-sm font-medium text-gray-600">
// // //             {videoAppointments.length} {videoAppointments.length === 1 ? 'consultation' : 'consultations'}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* No upcoming consultations */}
// // //       {videoAppointments.length === 0 ? (
// // //         <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// // //           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
// // //           </svg>
// // //           <h3 className="mt-3 text-lg font-medium text-gray-700">No upcoming video consultations</h3>
// // //           <p className="mt-1 text-sm text-gray-500">Your scheduled video consultations will appear here</p>
// // //         </div>
// // //       ) : (
// // //         <div className="bg-white shadow rounded-lg overflow-hidden">
// // //           <ul className="divide-y divide-gray-200">
// // //             {videoAppointments.map((item, index) => (
// // //               <li key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
// // //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// // //                   {/* Patient Info */}
// // //                   <div className="flex items-center gap-4 min-w-0">
// // //                     {item.userData?.image ? (
// // //                       <img className="h-12 w-12 rounded-full object-cover flex-shrink-0" src={item.userData.image} alt="Patient" />
// // //                     ) : (
// // //                       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
// // //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// // //                         </svg>
// // //                       </div>
// // //                     )}
// // //                     <div className="min-w-0">
// // //                       <h4 className="text-lg font-semibold text-gray-800 truncate">{item.userData?.name || 'Patient'}</h4>
// // //                       <p className="text-sm text-gray-500 truncate">{item.userData?.email}</p>
// // //                       <div className="mt-1 flex flex-wrap gap-2">
// // //                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
// // //                           item.status === 'completed' ? 'bg-green-100 text-green-800' :
// // //                           item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
// // //                         }`}>
// // //                           {item.status === 'completed' ? 'Completed' : 
// // //                            item.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Appointment Time */}
// // //                   <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:px-4 md:py-2.5">
// // //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
// // //                     </svg>
// // //                     <div className="ml-2">
// // //                       <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
// // //                         {item.slotDate.replaceAll('_', '/')}
// // //                       </p>
// // //                       <p className="text-sm text-gray-500 whitespace-nowrap">
// // //                         {item.slotTime}
// // //                       </p>
// // //                     </div>
// // //                   </div>

// // //                   {/* Actions */}
// // //                   <div className="flex-shrink-0">
// // //                     {item.status !== 'completed' ? (
// // //                       <button
// // //                         onClick={() => {
// // //                           if (!canStartCall(item)) {
// // //                             toast.error('You can only join the call during the scheduled time window');
// // //                             return;
// // //                           }
// // //                           startVideoCall(item);
// // //                         }}
// // //                         disabled={isCallStarting}
// // //                         className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
// // //                           canStartCall(item) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // //                         }`}>
// // //                         {isCallStarting && activeCall === item ? 'Starting Call...' : 'Start Video Call'}
// // //                       </button>
// // //                     ) : (
// // //                       <button onClick={endVideoCall} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md">
// // //                         End Call
// // //                       </button>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default VideoConsultations;
