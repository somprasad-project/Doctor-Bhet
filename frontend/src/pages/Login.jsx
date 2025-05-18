
// import React, { useContext, useEffect, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react'; // 👈 Import Lucide icons

// const Login = () => {
//   const { backendUrl, token, setToken } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [state, setState] = useState('Sign Up');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // 👈 New state for toggling

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     try {
//       if (state === 'Sign Up') {
//         const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email });
//         if (data.success) {
//           toast.success("Account created successfully! Please login.");
//           setState('Login');
//         } else {
//           toast.error(data.message);
//         }
//       } else {
//         const { data } = await axios.post(backendUrl + '/api/user/login', { password, email });
//         if (data.success) {
//           localStorage.setItem('token', data.token);
//           setToken(data.token);
//           navigate('/');
//         } else {
//           toast.error(data.message);
//         }
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate('/');
//     }
//   }, [token, navigate]);

//   return (
//     <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
//       <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[360px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
//         <p className="text-2xl font-semibold">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </p>
//         <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

//         {/* Full Name - Only for Sign Up */}
//         {state === 'Sign Up' && (
//           <div className="w-full">
//             <p>Full Name</p>
//             <input
//               className="border border-zinc-300 rounded w-full p-2 mt-1"
//               type="text"
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//               required
//             />
//           </div>
//         )}

//         {/* Email */}
//         <div className="w-full">
//           <p>Email</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="email"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             required
//           />
//         </div>

//         {/* Password with Eye Toggle */}
//         <div className="w-full relative">
//           <p>Password</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10"
//             type={showPassword ? 'text' : 'password'}
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             required
//           />
//           <span
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer text-zinc-500"
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </span>
//         </div>

//         {/* Submit Button */}
//         <button type='submit' className="bg-blue-500 text-white w-full py-2 rounded-md text-base">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </button>

//         {/* Switch Auth State */}
//         {state === 'Sign Up' ? (
//           <p>
//             Already have an account?{' '}
//             <span
//               onClick={() => setState('Login')}
//               className="text-blue-500 underline cursor-pointer"
//             >
//               Login Here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Don't have an account?{' '}
//             <span
//               onClick={() => setState('Sign Up')}
//               className="text-blue-500 underline cursor-pointer"
//             >
//               Create one here
//             </span>
//           </p>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Login;

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email });
        if (data.success) {
          toast.success("Account created successfully! Please login.");
          setState('Login');
          // Clear form fields after successful registration
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error;
        
        if (errorMessage.toLowerCase().includes('password') || error.response.status === 401) {
          toast.error('Incorrect password. Please try again.');
          setPassword('');
        } else if (errorMessage.toLowerCase().includes('email') || 
                  errorMessage.toLowerCase().includes('user') || 
                  error.response.status === 404) {
          toast.error('Email not found. Please check or create an account.');
          setEmail('');
        } else {
          toast.error(errorMessage || 'An error occurred during login.');
        }
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = () => {
    navigate("/forget-password");
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[360px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-zinc-800">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-zinc-500">Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

        {/* Full Name - Only for Sign Up */}
        {state === 'Sign Up' && (
          <div className="w-full">
            <label className="block text-zinc-700 mb-1">Full Name</label>
            <input
              className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <label className="block text-zinc-700 mb-1">Email</label>
          <input
            className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="w-full">
          <label className="block text-zinc-700 mb-1">Password</label>
          <div className="relative">
            <input
              className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-700 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={15} className="stroke-current" />
              ) : (
                <Eye size={15} className="stroke-current" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link - Only shown on Login */}
        {state === 'Login' && (
          <div className="w-full text-right -mt-1">
            <button
              type="button"
              onClick={handlePasswordChange}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            'Processing...'
          ) : state === 'Sign Up' ? (
            'Create Account'
          ) : (
            'Login'
          )}
        </button>

        {/* Switch Auth State */}
        <div className="w-full text-center text-sm text-zinc-600">
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Login')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Login Here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Sign Up')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Create one here
              </button>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext';
// import axios from 'axios'
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const { backendUrl, token, setToken } = useContext(AppContext)
//   const navigate = useNavigate()  // Correcting the use of navigate
//   const [state, setState] = useState('Sign Up')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')

//   const onSubmitHandler = async (event) => {
//     event.preventDefault()
//     try {
//       if (state === 'Sign Up') {
//         const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        
//         if (data.success) {
//           toast.success("Account created successfully! Please login.")
//           setState('Login')  // Switch to Login state after sign up
//         } else {
//           toast.error(data.message)
//         }
        
//       } else {
//         const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        
//         if (data.success) {
//           localStorage.setItem('token', data.token)
//           setToken(data.token)
//           navigate('/')  // Redirect to home page after successful login
//         } else {
//           toast.error(data.message)
//         }
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     if (token) {
//       navigate('/')  // Redirect to home page if the user is already logged in
//     }
//   }, [token, navigate])

//   return (
//     <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
//       <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[360px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
//         <p className="text-2xl font-semibold">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </p>
//         <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

//         {/* Full Name - Visible only for Sign Up */}
//         {state === 'Sign Up' && (
//           <div className="w-full">
//             <p>Full Name</p>
//             <input
//               className="border border-zinc-300 rounded w-full p-2 mt-1"
//               type="text"
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//               required
//             />
//           </div>
//         )}

//         {/* Email */}
//         <div className="w-full">
//           <p>Email</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="email"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             required
//           />
//         </div>

//         {/* Password */}
//         <div className="w-full">
//           <p>Password</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="password"
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <button type='submit' className="bg-blue-500 text-white w-full py-2 rounded-md text-base">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </button>

//         {/* Switch between Sign Up and Login */}
//         {state === 'Sign Up' ? (
//           <p>
//             Already have an account?{' '}
//             <span
//               onClick={() => setState('Login')}
//               className="text-blue-500 underline cursor-pointer"
//             >
//               Login Here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Don't have an account?{' '}
//             <span
//               onClick={() => setState('Sign Up')}
//               className="text-blue-500 underline cursor-pointer"
//             >
//               Create one here
//             </span>
//           </p>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Login;
