import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
             {/*-----------------left side-----------------*/}
             <div >
                <img className='mb-5 w-20' src={assets.logo} alt=''/>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
             </div>


             {/*-----------------middle side-----------------*/}
             <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About US</li>
                    <li>Contact Us</li>
                    <li>privacu policy</li>
                </ul>
             </div>


             {/*-----------------right side-----------------*/}
             <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>phone number</li>
                    <li>email</li>
               
                </ul>
             </div>
               
             </div>
              {/*----------------- copy text----------------*/}
              <div>
             <hr />
             <p></p>

        </div>
    </div>
  )
}

export default Footer