

import React, { createContext, useState } from "react"; // Import useState
import { doctors } from "../assets/assets";
// import { toast } from 'react-toastify'; // Not needed unless you use it in this file

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = ' NPR ';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') || false); // Correctly using useState

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
  };

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