import React from 'react'
import { assets } from '../assets/assets'

const ContactUS = () => {
  return (
    <div>
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p className='text-gray-700 font-semibold'>Contact <span className='text-gray-700 font-semibold'>US</span></p>
            </div>
            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
                <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-lg'>Our OFFICE</p>
                    <p className='text-gray-600'>Naxal Bhagawati Marga, <br/>Kathmandu, Nepa</p>
                    <p className='text-gray-600'>Tel: (415) 555‑0132 <br/>Email: DoctorBhet@gmail.com</p>
                    <p className='font-semibold text-lg text-gray-600'>Careers at Docotr Bhet</p>
                    <p className='text-gray-500'>Learn more about our teams and job openings.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ContactUS