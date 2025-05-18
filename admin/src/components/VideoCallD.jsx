import React, { useEffect, useRef } from 'react';

const VideoCallD = ({ appointment, onClose, userInfo, roomPassword }) => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    // Load Jitsi Meet API script dynamically
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initializeJitsi;
    script.onerror = () => {
      console.error('Failed to load Jitsi Meet API');
      onClose();
      toast.error('Failed to load video call service. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI) {
      console.error('Jitsi Meet API not available');
      onClose();
      toast.error('Video call service unavailable. Please try again later.');
      return;
    }

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
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableSimulcast: false,
        enableNoisyMicDetection: false,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_CHROME_EXTENSION_BANNER: false,
        MOBILE_APP_PROMO: false,
        HIDE_INVITE_MORE_HEADER: true,
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    // Set moderator password
    apiRef.current.on('participantRoleChanged', (event) => {
      if (event.role === 'moderator') {
        apiRef.current.executeCommand('password', roomPassword);
      }
    });

    // Handle call closure
    apiRef.current.on('readyToClose', () => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          ​
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Video Consultation with {appointment.userData?.name || 'Patient'}
                </h3>
                <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallD;