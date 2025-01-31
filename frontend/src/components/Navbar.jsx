import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AppContext);  // Correct hook usage
    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');  // Redirect to login after logout
    };

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <img onClick={() => navigate('/')} className="w-20 h-auto cursor-pointer" src={assets.logo} alt="Logo" />

            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to="/">
                    <li className="py-1">Home</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">ALL DOCTORS</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/about">
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/contact">
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to="/symptom-checker">
                    <li className="py-1">SYMPTOM CHECKER</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
            </ul>

            <div className="flex items-center gap-4">
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
                        <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                <p onClick={() => navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                <p onClick={() => navigate('my-appointment')} className="hover:text-black cursor-pointer">My Appointments</p>
                                <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p> {/* Fixed logout click */}
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/Login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">Create account</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;


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
