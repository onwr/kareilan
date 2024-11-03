import React from 'react'
import logo from '@images/logo.png'
import emlakBG from '@images/emlakbg.avif'


const Loader = () => {
  return (
    <div className='flex flex-col gap-3 items-center justify-center min-h-screen'>
        <img src={emlakBG} className='absolute opacity-10 bg-cover top-0 bottom-0 w-full h-full z-0' />
        <img src={logo} className='w-32 h-32 animate-spin' />
        <p className='text-2xl z-10 font-medium'>kareilan.com</p>
        <p className='z-10'>Yükleniyor...</p>
    </div>
  )
}

export default Loader