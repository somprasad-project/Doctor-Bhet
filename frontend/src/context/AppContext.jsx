

// import React, { createContext, useState, useEffect } from "react";
// import axios from 'axios';
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// const AppContextProvider = ({ children }) => {
//   const currencySymbol = ' NPR ';
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [doctors, setDoctors] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Axios instance with interceptors
//   const api = axios.create({
//     baseURL: backendUrl,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : undefined
//     }
//   });

//   // Add response interceptor
//   api.interceptors.response.use(
//     response => response,
//     error => {
//       if (error.response?.status === 401) {
//         handleLogout();
//         toast.error('Session expired. Please login again.');
//       }
//       return Promise.reject(error);
//     }
//   );

//   const handleLogin = (token) => {
//     localStorage.setItem('token', token);
//     setToken(token);
//     loadUserProfileData();
//     getAppointments();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUserData(null);
//     setAppointments([]);
//     navigate('/login');
//   };

//   const getDoctorsData = async () => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.get('/api/doctor/list');
//       if (data.success) {
//         setDoctors(data.doctors);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch doctors');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUserProfileData = async () => {
//     try {
//       if (!token) return;
      
//       const { data } = await api.get('/api/user/get-profile');
//       if (data.success) {
//         setUserData(data.userData);
//       }
//     } catch (error) {
//       console.error('Profile load error:', error);
//       if (error.response?.status === 401) {
//         handleLogout();
//       }
//     }
//   };

//   const getAppointments = async () => {
//     try {
//       if (!token) return;
      
//       setIsLoading(true);
//       const { data } = await api.get('/api/user/appointments');
//       if (data.success) {
//         setAppointments(data.appointments);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch appointments');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const bookAppointment = async (appointmentData) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.post('/api/user/book-appointment', appointmentData);
//       if (data.success) {
//         toast.success('Appointment booked successfully');
//         getAppointments();
//         return data.appointment;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to book appointment');
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.post('/api/user/cancel-appointment', { appointmentId });
//       if (data.success) {
//         toast.success('Appointment cancelled successfully');
//         getAppointments();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to cancel appointment');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCallDetails = async (appointmentId) => {
//     try {
//       const { data } = await api.get(`/api/appointments/${appointmentId}/call-details`);
//       if (data.success) {
//         return data;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to get call details');
//       throw error;
//     }
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       setIsLoading(true);
//       const { data } = await api.put('/api/user/update-profile', profileData);
//       if (data.success) {
//         toast.success('Profile updated successfully');
//         loadUserProfileData();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     getDoctorsData();
//     if (token) {
//       loadUserProfileData();
//       getAppointments();
//     }
//   }, [token]);

//   const value = {
//     currencySymbol,
//     backendUrl,
//     token,
//     doctors,
//     appointments,
//     userData,
//     isLoading,
    
//     // Auth functions
//     handleLogin,
//     handleLogout,
    
//     // Data functions
//     getDoctorsData,
//     getAppointments,
//     bookAppointment,
//     cancelAppointment,
//     updateProfile,
//     loadUserProfileData,
    
//     // Video call functions
//     getCallDetails,
    
//     // State setters
//     setUserData
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContextProvider;


import React, { createContext, useState } from "react"; // Import useState
import axios from 'axios'
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = ' NPR ';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') || false); // Correctly using useState
  const [doctors, setDoctors] = useState([])
// for the updated profile
  const [userData, setUserData] = useState(false)

 


  


  const getDoctorsData = async () => {
    try {

      const {data} = await axios.get(backendUrl + '/api/doctor/list')

      if (data.success) {

        setDoctors(data.doctors)

        
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

  const loadUserProfileData = async () => {
    try {

      const {data} = await axios.get(backendUrl + '/api/user/get-profile', {headers:{token}})

      if (data.success) {

        setUserData(data.userData)
        
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      
      console.log(error)
      toast.error(error.message)
    }
  }


  const value = {
    doctors, 
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData
  };






      useEffect(()=>{
        getDoctorsData()
      },[])

      useEffect(()=>{
        if (token) {

          loadUserProfileData()
        } else{
          setUserData(false)
        }
      },[token])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;




// // import { createContext } from "react";
// // import { doctors } from "../assets/assets";
// // import {toast} from 'react-toastify'

// // export const AppContext =createContext()

// // const AppContextProvider =(props) =>{
// //     const currencySymbol ='$'
// //     const backendUrl =import.meta.env.VITE_BACKEND_URL
// //     const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

// //     const value = {
// //         doctors,
// //         currencySymbol, 
// //         token,setToken, 
// //         backendUrl

// //     }
// //     return(
// //         <AppContext.Provider value={value}>
// //             {props.children}
// //         </AppContext.Provider>
// //     )
// // }

// // export default AppContextProvider