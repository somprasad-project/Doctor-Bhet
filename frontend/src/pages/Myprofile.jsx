// import React, { useContext, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import { assets } from '../assets/assets'
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const Myprofile = () => {

//   const {userData, setUserData, token, backendUrl, loadUserProfileData} = useContext(AppContext)





//     const [isEdit, setIsEdit] = useState(false)
//     //store the image 
//     const [image,setImage] = useState(false)

//     const updateUserProfileData = async ( ) => {

//         try {

//             const formData = new FormData()

//             formData.append('name', userData.name)
//             formData.append('phone', userData.phone)
//             formData.append('address',JSON.stringify(userData.address))
//             formData.append('gender', userData.gender)
//             formData.append('dob', userData.dob)

//             image && formData.append('image', image)

//             const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData, {headers:{token}})

//             if (data.success) {
//                 toast.success(data.message)
//                 await loadUserProfileData()
//                 setIsEdit(false)
//                 setImage(false)
//             }else{
//                 toast.error(data.message)
//             }
            
//         } catch (error) {

//             console.log(error)
//             toast.error(error.message)
            
//         }


//     }

//     return userData && (
//         <div className='max-w-lg flex flex-col gap-2 text-sm'>

//             {
//                 isEdit
//                 ? <label htmlFor="image">
//                     <div className='inline-block realtive cursor-pointer'>
//                         <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image): userData.image} alt=" " />
//                         <img className='w-10 absolute bottom-12 right-12'  src={image ? '': assets.upload_icon} alt=" " />
//                     </div>
//                      <input onChange={(e)=> setImage(e.target.files[0])} type="file" id="image" hidden />

//                 </label>
//                 :<img className='w-36 rounded' src={userData.image} alt=" " />
//             }
            
//             {
//                 isEdit
//                     ? <input className='bg-gray-50 text-3xl' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
//                     : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
//             }

//             <hr className='bg-zinc-400 h-[1px] border-none'/>
//             <div>
//                 <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
//                     <p className='font-large'>Email Id:</p>
//                     <p className='text-blue-600'>{userData.email}</p>
//                     <p className='font-large'>Phone No:</p>
//                     {
//                         isEdit
//                             ? <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
//                             : <p className='text-gray-500'>{userData.phone}</p>
//                     }

//                     <p className='font-large'>Address:</p>
//                     {
//                         isEdit ?
//                             <p>
//                                 <input className='bg-gray-100' onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} type="text" />
//                                 <br />
//                                 <input className='bg-gray-100'  onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} type="text" />


//                             </p>
//                             : <p className='text-gray-500' >
//                                 {userData.address.line1}
//                                 <br />
//                                 {userData.address.line2}
//                             </p>
//                     }

//                 </div>

//             </div>

//             <div>
//                 <p className='text-neutral-500 underline mt-3'> BASIC INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-2.5 mt-3 text-neutral-700'>
//                     <p className='font-large'>Gender:</p>
//                     {
//                         isEdit
//                             ? <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                             </select>
//                             : <p className='text-gray-500'>{userData.gender}</p>
//                     }

//                     <p className='font-large'>Date Of Birth:</p>
//                     {
//                         isEdit
//                          ? <input className='max-w-28 bg-gray-100' type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob}/>
//                         : <p className='text-gray-500'> {userData.dob }</p>
//                     }
//             </div>

//             </div>

//             <div className='mt-10'>
//                 {
//                     isEdit
//                     ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfileData }> Save Information</button>
//                     : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>    
                    
//                 }

//             </div>

//         </div>
//     )

// }

// export default Myprofile

import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'; // Adjust path if needed
import { Edit2, Lock, User, Mail, Phone, Calendar, MapPin, Save, X, KeyRound, Eye, EyeOff } from 'lucide-react';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/change-password`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (data.success) {
        toast.success(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return userData && (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal information and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-4">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-200"
              />
              {isEdit && (
                <label htmlFor="image" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Edit2 className="h-5 w-5" />
                  <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                </label>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
            <p className="text-sm text-gray-500">Patient</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left font-medium ${activeTab === 'general' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <User className="h-5 w-5" />
                General
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left font-medium ${activeTab === 'security' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Lock className="h-5 w-5" />
                Security
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {activeTab === 'general' ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Full Name
                  </label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-600">{userData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email
                  </label>
                  <p className="text-gray-600">{userData.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Number
                  </label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-600">{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date of Birth
                  </label>
                  {isEdit ? (
                    <input
                      type="date"
                      value={userData.dob}
                      onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-600">{userData.dob || 'Not specified'}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </label>
                {isEdit ? (
                  <textarea
                    value={userData.address?.line1 || ''}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-600">{userData.address?.line1 || 'No address provided'}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                {isEdit ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setImage(false);
                        loadUserProfileData();
                      }}
                      className="px-5 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 flex items-center gap-2"
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                    <button
                      onClick={updateUserProfileData}
                      className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="h-5 w-5" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Change Password</h3>

              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <KeyRound className="h-5 w-5" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;