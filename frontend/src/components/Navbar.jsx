// import React, { useContext, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';
// import { AppContext } from '../context/AppContext';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const { token, setToken , userData} = useContext(AppContext);  // Correct hook usage
//     const logout = () => {
//         setToken(false);
//         localStorage.removeItem('token');
//         navigate('/login');  // Redirect to login after logout
//     };

//     return (
//         <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
//             <img onClick={() => navigate('/')} className="w-20 h-auto cursor-pointer" src={assets.logo} alt="Logo" />

//             <ul className="hidden md:flex items-start gap-5 font-medium">
//                 <NavLink to="/">
//                     <li className="py-1">Home</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
//                 <NavLink to="/doctors">
//                     <li className="py-1">ALL DOCTORS</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
//                 <NavLink to="/my-appointment">
//                     <li className="py-1">My Appointments</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
//                 <NavLink to="/symptom-checker">
//                     <li className="py-1">SYMPTOM CHECKER</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
                
//                 <NavLink to="/about">
//                     <li className="py-1">ABOUT</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
//                 <NavLink to="/contact">
//                     <li className="py-1">CONTACT</li>
//                     <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
//                 </NavLink>
                

//             </ul>

//             <div className="flex items-center gap-4">
//                 {token && userData
//                 ?  
//                     <div className="flex items-center gap-2 cursor-pointer group relative">
//                         <img className="w-8 rounded-full" src={userData.image} alt="Profile" />
//                         <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
//                         <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
//                             <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
//                                 <p onClick={() => navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
//                                 <p onClick={() => navigate('')} className="hover:text-black cursor-pointer">My Appointments</p>
//                                 <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p> {/* Fixed logout click */}
//                             </div>
//                         </div>
//                     </div>
//                  : 
//                     <button onClick={() => navigate('/Login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">Create account</button>
//                 }
//             </div>
//         </div>
//     );
// };

//  export default Navbar;


// import React, { useContext, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';
// import { AppContext } from '../context/AppContext';

// const Navbar = () => {
//     const navigate = useNavigate();
//     // const [showMenu, setShowMenu] = useState(false);
//     const [token, setToken] = useContext(AppContext) // Correct hook usage
//     const logout =()=>{
//         setToken(false)
//         localStorage.removeItem('token')
//     }

//     return (
//         <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
//             <img onClick={()=> navigate('/')} className="w-20 h-auto cursor-pointer" src={assets.logo} alt="Logo" />

//             <ul className="hidden md:flex items-start gap-5 font-medium">
//                 <NavLink to="/">
//                     <li className="py-1">Home</li>
//                     <hr className ='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//                 </NavLink>
//                 <NavLink to="/doctors">
//                     <li className="py-1">ALL DOCTORS</li>
//                     <hr className ='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//                 </NavLink>
//                 <NavLink to="/about">
//                     <li className="py-1">ABOUT</li>
//                     <hr className ='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//                 </NavLink>
//                 <NavLink to="/contact">
//                     <li className="py-1">CONTACT</li>
//                     <hr className ='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//                 </NavLink>
//                 <NavLink to="/symptom-checker">
//                     <li className="py-1">SYMPTOM CHECKER</li>
//                     <hr className ='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
//                 </NavLink>
//             </ul>
//            <div className= 'flex items-center gap-4'>
//             {
//                 token
//                 ? <div  className='flex item-center gap-2 cursor-pointer group relative'>
//                     <img className= '  w-8 rounded-full' src={assets.profile_pic} alt=" " />
//                     <img className='w-2.5 ' src={assets.dropdown_icon} alt=""/>
//                     <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//                         <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                             <p onClick = {()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
//                             <p onClick = {()=>navigate('my-appointment')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                             <p onclick = {() => setToken(false)}className='hover:text-black cursor-pointer'>Logout</p>
//                         </div>
//                     </div>
//                 </div>
//                 :<button onClick={()=>navigate('/Login')} className= 'bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
//             }
            
//            </div>
//         </div>
//     );
// };

// export default Navbar;


import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
        setShowDropdown(false);
    };

    // Active link style
    const navLinkStyle = ({ isActive }) => ({
        color: isActive ? '#2563eb' : '#4b5563',
        fontWeight: isActive ? '600' : '500',
        position: 'relative'
    });

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-15">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div 
                        onClick={() => navigate('/')} 
                        className="flex items-center cursor-pointer"
                    >
                        <img 
                            className="h-10 w-auto" 
                            src={assets.logo} 
                            alt="Logo" 
                        />
                        {/* <span className="ml-2 text-xl font-semibold text-gray-800 hidden sm:inline">
                            HealthCare
                        </span> */}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink 
                            to="/" 
                            style={navLinkStyle}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <span className="relative">
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </NavLink>
                        <NavLink 
                            to="/doctors" 
                            style={navLinkStyle}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <span className="relative">
                                Doctors
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </NavLink>
                        <NavLink 
                            to="/my-appointment" 
                            style={navLinkStyle}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <span className="relative">
                                Appointments
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </NavLink>
                        <NavLink 
                            to="/symptom-checker" 
                            style={navLinkStyle}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <span className="relative">
                                Symptom Checker
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </NavLink>
                        <NavLink 
                            to="/about" 
                            style={navLinkStyle}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <span className="relative">
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </NavLink>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {token && userData ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="relative">
                                        <img 
                                            className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm" 
                                            src={userData.image} 
                                            alt="Profile" 
                                        />
                                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                                        <button 
                                            onClick={() => {
                                                navigate('/my-profile');
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </button>
                                        <button 
                                            onClick={() => {
                                                navigate('/my-appointment');
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Appointments
                                        </button>
                                        <button 
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;