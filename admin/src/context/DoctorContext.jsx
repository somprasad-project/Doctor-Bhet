
import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // const [appointments, setAppointments] = useState([])

    const [appointments, setAppointments] = useState([])

    const getAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            


            if (data.success) {

                setAppointments(data.appointments)
                console.log(data.appointments)

            } else {

                toast.error(data.message)


            }
        } catch (error) {

            console.log(error);
            toast.error(error.message)

        }
    }

    const completeAppointment = async (appointmentId) => {

        try {

            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers:{dToken}})

            if (data.success) {

                toast.success(data.message)
                getAppointments()

            }else{
                toast.error(data.message)
            }
            
        } catch (error) {

            console.log(error);
            toast.error(error.message)
            
        }

    }

    const cancelAppointment = async (appointmentId) => {

        try {

            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{dToken}})

            if (data.success) {

                toast.success(data.message)
                getAppointments()

            }else{
                toast.error(data.message)
            }
            
        } catch (error) {

            console.log(error);
            toast.error(error.message)
            
        }

    }

    //doc dashbord

    const getDashData = async() =>{
        try {

            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers: { dToken }})
            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData);

            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProfileData = async () =>{
        try {
            
            const {data} =await axios.get(backendUrl + '/api/doctor/profile',{headers: { dToken }} )
            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData)
            } 

        } catch (error) {
            
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        cancelAppointment, completeAppointment,
        dashData,setDashData,getDashData,
        profileData, setProfileData, getProfileData
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider


// import { createContext, useState, useEffect } from "react";
// import axios from 'axios';
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export const DoctorContext = createContext();

// const DoctorContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [dToken, setDToken] = useState(localStorage.getItem('dToken') || null);
//   const [dashData, setDashData] = useState(null);
//   const [profileData, setProfileData] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeVideoCall, setActiveVideoCall] = useState(null);
//   const navigate = useNavigate();

//   // Configure axios instance
//   const api = axios.create({
//     baseURL: backendUrl,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': dToken ? `Bearer ${dToken}` : undefined
//     }
//   });

//   // Response interceptor for handling 401 errors
//   api.interceptors.response.use(
//     response => response,
//     error => {
//       if (error.response?.status === 401) {
//         handleDoctorLogout();
//         toast.error('Session expired. Please login again.');
//       }
//       return Promise.reject(error);
//     }
//   );

//   const handleDoctorLogin = (token) => {
//     localStorage.setItem('dToken', token);
//     setDToken(token);
//     loadDoctorData();
//   };

//   const handleDoctorLogout = () => {
//     localStorage.removeItem('dToken');
//     setDToken(null);
//     setProfileData(null);
//     setDashData(null);
//     setAppointments([]);
//     navigate('/doctor/login');
//   };

//   const loadDoctorData = async () => {
//     try {
//       setIsLoading(true);
//       await Promise.all([getProfileData(), getDashData(), getAppointments()]);
//     } catch (error) {
//       console.error('Error loading doctor data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getAppointments = async () => {
//     try {
//       const { data } = await api.get('/api/doctor/appointments');
//       if (data.success) {
//         setAppointments(data.appointments);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch appointments');
//     }
//   };

//   const completeAppointment = async (appointmentId) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.post('/api/doctor/complete-appointment', { appointmentId });
//       if (data.success) {
//         toast.success(data.message);
//         getAppointments();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to complete appointment');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.post('/api/doctor/cancel-appointment', { appointmentId });
//       if (data.success) {
//         toast.success(data.message);
//         getAppointments();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to cancel appointment');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getDashData = async () => {
//     try {
//       const { data } = await api.get('/api/doctor/dashboard');
//       if (data.success) {
//         setDashData(data.dashData);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to load dashboard data');
//     }
//   };

//   const getProfileData = async () => {
//     try {
//       const { data } = await api.get('/api/doctor/profile');
//       if (data.success) {
//         setProfileData(data.profileData);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to load profile');
//     }
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.put('/api/doctor/update-profile', profileData);
//       if (data.success) {
//         toast.success('Profile updated successfully');
//         getProfileData();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCallDetails = async (appointmentId) => {
//     try {
//       const { data } = await api.get(`/api/appointments/${appointmentId}/call-details`);
//       if (data.success) {
//         return {
//           roomName: data.roomName,
//           password: data.password,
//           patient: data.patient
//         };
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to get call details');
//       throw error;
//     }
//   };

//   const startVideoConsultation = async (appointment) => {
//     try {
//       setIsLoading(true);
//       const callDetails = await getCallDetails(appointment._id);
      
//       setActiveVideoCall({
//         ...appointment,
//         ...callDetails,
//         doctorName: profileData?.name || 'Doctor'
//       });
      
//     } catch (error) {
//       console.error('Error starting video call:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const endVideoConsultation = () => {
//     setActiveVideoCall(null);
//     getAppointments(); // Refresh appointments after call ends
//   };

//   // Load initial data when token changes
//   useEffect(() => {
//     if (dToken) {
//       loadDoctorData();
//     }
//   }, [dToken]);

//   const value = {
//     // Authentication
//     dToken,
//     handleDoctorLogin,
//     handleDoctorLogout,
    
//     // Doctor Data
//     profileData,
//     dashData,
//     appointments,
//     isLoading,
    
//     // Appointment Management
//     getAppointments,
//     completeAppointment,
//     cancelAppointment,
    
//     // Profile Management
//     getProfileData,
//     updateProfile,
    
//     // Video Consultation
//     activeVideoCall,
//     startVideoConsultation,
//     endVideoConsultation,
//     getCallDetails,
    
//     // Utility
//     backendUrl
//   };

//   return (
//     <DoctorContext.Provider value={value}>
//       {children}
//     </DoctorContext.Provider>
//   );
// };

// export default DoctorContextProvider;