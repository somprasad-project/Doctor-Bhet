import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Appointment from './pages/Appointment';
import Doctors from './pages/Doctors';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/docotrs/:speciality' element ={<Doctors/>}/>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
