import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Appointment from './pages/Appointment';
import Doctors from './pages/Doctors';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Myprofile from './pages/Myprofile';
import MyAppointments from './pages/MyAppointments';

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element ={<Doctors/>}/>
        <Route path='/my-profile' element={<Myprofile/>}/>
        <Route path='/my-appointment' element={<MyAppointments/>}/>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
