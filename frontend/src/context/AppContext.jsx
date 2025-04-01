

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




// import { createContext } from "react";
// import { doctors } from "../assets/assets";
// import {toast} from 'react-toastify'

// export const AppContext =createContext()

// const AppContextProvider =(props) =>{
//     const currencySymbol ='$'
//     const backendUrl =import.meta.env.VITE_BACKEND_URL
//     const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

//     const value = {
//         doctors,
//         currencySymbol, 
//         token,setToken, 
//         backendUrl

//     }
//     return(
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

// export default AppContextProvider