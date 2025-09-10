import Image from "next/image";
import { FaApple, FaLocationArrow, FaPlaystation } from 'react-icons/fa'
import { GrMapLocation } from 'react-icons/gr'

export default function Home() {
  return (
    <div className='relative w-full h-screen flex justify-center flex-col'>
    <div className='w-[90%] md:w-[80%] mx-auto items-center grid grid-cols-1 md:grid-cols-2 gap-10'>
    {/* Text content */}
    <div>
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="w-15 h-15 rounded-lg flex items-center justify-center mr-3">
          <Image
            src="/icon/icon.png"
            alt="Sellora Logo"
            width={50}
            height={50}
            className="rounded-sm"
          />
        </div>
        <span className="text-3xl font-bold text-gray-900">Stockify</span>
      </div>
    
    <div className='flex flex-col gap-6'>
      <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-black dark:text-white sm:leading-[2.5rem] md:leading-[4.5rem]'>
        Welcome, {" "} <span className='text-blue-400'>Back</span>
      </h1>
      <p className='text-gray-600 text-xl md:text-base font-medium'>
          A whole new experience of managing your stocks
      </p>
      
      {/* Login Form */}
      <div className="w-full max-w-md">
        <form className="bg-white rounded-lg  p-2 space-y-8">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>

          {/* Keep me login & Recovery Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-gray-100 "
              />
              <span className="ml-2 text-sm text-gray-700">Keep me login</span>
            </label>
            <a href="#" className="text-sm text-gray-700 hover:text-blue-600">Recovery Password</a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            SIGN IN
          </button>
        </form>
      </div>
     
      {/* <p className='text-gray-400'>Apps available to download</p>
      
      <div className='flex space-x-4'>
          <a href="#"
          className='flex items-center justify-between group border border-gray-400 px-4 py-4 rounded-md'>
            <FaApple className='text-xl font-black' />
            <div className='ml-3'>
              <p className='text-xs'>Download on the</p>
              <p className='text-sm'>App store</p>
            </div>
          </a>
           <a href="#"
          className='flex items-center justify-between group border border-gray-400 px-4 py-4 rounded-md'>
            <FaPlaystation className='text-xl font-black' />
            <div className='ml-3'>
              <p className='text-xs'>Download on the</p>
              <p className='text-sm'>Play store</p>
            </div>
          </a>
      </div> */}
    </div>
    </div>
    {/* Image content */}
    <div
    className='mx-auto hidden md:block '>
      <Image 
      src="/login/login.webp"
      alt="Hero Image"
      width={800}
      height={800}
      className='rounded-lg'
      />
    </div>
    </div>
    
</div>
  );
}
