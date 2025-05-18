import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';


import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/doctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashBoard from './pages/Doctor/DoctorDashBoard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import AllAppointment from './pages/Admin/AllAppointment';
import DashBoard from './pages/Admin/Dashboard';
import VideoConsultations from './pages/Doctor/VideoConsultations';


const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext( DoctorContext)
  return aToken || dToken ?  (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Route */}

          <Route path='/admin-dashboard' element={<DashBoard/>} />
          <Route path='/all-appointments' element={<AllAppointment/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorList/>} />

          {/* Doctor Route */}
          <Route path='/doctor-dashboard' element={<DoctorDashBoard/>} />
          <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
          <Route path='/video-call' element={<VideoConsultations/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />

          
        </Routes>

      </div>
    </div>
  ) : (
    <>
    <Login />
    <ToastContainer/>
    </>
  )
}

export default App