import React, { useEffect, useRef } from 'react';
import { FaPhoneSlash } from 'react-icons/fa';

const VideoCall = ({ appointment, onClose, userInfo }) => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initializeJitsi;
    document.body.appendChild(script);

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  const initializeJitsi = () => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: appointment.roomName,
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      userInfo: {
        displayName: userInfo.name,
        email: userInfo.email,
      },
      configOverwrite: {
        startWithAudioMuted: !userInfo.isDoctor,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableSimulcast: false,
        constraints: {
          video: {
            height: { ideal: 720, max: 720, min: 240 }
          }
        },
        // Enable these if using password
        // password: appointment.password,
        // requirePassword: true
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'Medical Consultation',
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'hangup', 'chat', 'settings', 'raisehand', 'videoquality', 'tileview'
        ],
      }
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    apiRef.current = api;

    api.on('readyToClose', () => {
      onClose();
    });

    api.on('videoConferenceJoined', () => {
      setLoading(false);
      setCallStarted(true);
      if (userInfo.isDoctor) {
        api.executeCommand('displayName', `Dr. ${userInfo.name}`);
        // api.executeCommand('password', appointment.password); // If using password
      }
    });

    api.on('participantJoined', (participant) => {
      if (participant.displayName.includes('Dr.')) {
        toast.success('Doctor has joined the call');
      } else {
        toast.success('Patient has joined the call');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-center text-white">
            <FaSpinner className="animate-spin text-4xl mb-4 mx-auto" />
            <p>Connecting to video consultation...</p>
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />
      
      <button
        onClick={onClose}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 flex items-center"
      >
        <FaPhoneSlash className="mr-2" /> End Call
      </button>
    </div>
  );
};

export default VideoCall;


// import React, { useEffect, useRef } from 'react';

// const VideoCall = ({ appointment, onClose, userInfo }) => {
//   const containerRef = useRef(null);
//   const apiRef = useRef(null);

//   useEffect(() => {
//     // Load Jitsi Meet API script dynamically
//     const script = document.createElement('script');
//     script.src = 'https://meet.jit.si/external_api.js';
//     script.async = true;
//     script.onload = initializeJitsi;
//     document.body.appendChild(script);

//     return () => {
//       if (apiRef.current) {
//         apiRef.current.dispose();
//       }
//       document.body.removeChild(script);
//     };
//   }, []);

//   const initializeJitsi = () => {
//     const domain = 'meet.jit.si';
//     const roomName = `consultation-${appointment._id}`;
    
//     const options = {
//       roomName,
//       width: '100%',
//       height: '100%',
//       parentNode: containerRef.current,
//       userInfo: {
//         displayName: userInfo.name,
//         email: userInfo.email,
//       },
//       configOverwrite: {
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         prejoinPageEnabled: false,
//       },
//     };

//     apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

//     apiRef.current.on('readyToClose', () => {
//       onClose();
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-white">
//       <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//       >
//         End Call
//       </button>
//     </div>
//   );
// };

// export default VideoCall;




// // src/components/VideoCall.jsx
// // import React, { useEffect, useRef } from 'react';

// // const VideoCall = ({ appointment, onClose, userInfo }) => {
// //   const containerRef = useRef(null);
// //   const apiRef = useRef(null);

// //   useEffect(() => {
// //     // Load Jitsi Meet API script dynamically
// //     const script = document.createElement('script');
// //     script.src = 'https://meet.jit.si/external_api.js';
// //     script.async = true;
// //     script.onload = initializeJitsi;
// //     document.body.appendChild(script);

// //     return () => {
// //       if (apiRef.current) {
// //         apiRef.current.dispose();
// //       }
// //       document.body.removeChild(script);
// //     };
// //   }, []);

// //   const initializeJitsi = () => {
// //     const domain = 'meet.jit.si';
// //     const roomName = `appointment-${appointment._id}-${Date.now()}`;
    
// //     const options = {
// //       roomName: roomName,
// //       width: '100%',
// //       height: '100%',
// //       parentNode: containerRef.current,
// //       userInfo: {
// //         displayName: userInfo.name,
// //         email: userInfo.email,
// //       },
// //       configOverwrite: {
// //         startWithAudioMuted: false,
// //         startWithVideoMuted: false,
// //         disableSimulcast: false,
// //         enableNoisyMicDetection: false,
// //         prejoinPageEnabled: false
// //       },
// //       interfaceConfigOverwrite: {
// //         DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
// //         SHOW_CHROME_EXTENSION_BANNER: false,
// //         MOBILE_APP_PROMO: false,
// //         HIDE_INVITE_MORE_HEADER: true
// //       }
// //     };

// //     apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

// //     apiRef.current.on('readyToClose', () => {
// //       onClose();
// //     });

// //     apiRef.current.on('participantRoleChanged', (event) => {
// //       if (event.role === 'moderator') {
// //         apiRef.current.executeCommand('password', 'doctor123');
// //       }
// //     });
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 overflow-y-auto">
// //       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
// //         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
// //           <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
// //         </div>
// //         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
// //           &#8203;
// //         </span>
// //         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
// //           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
// //             <div className="sm:flex sm:items-start">
// //               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
// //                 <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
// //                   Video Consultation with Dr. {appointment.docData.name}
// //                 </h3>
// //                 <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
// //             <button
// //               onClick={onClose}
// //               type="button"
// //               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
// //             >
// //               End Call
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoCall;