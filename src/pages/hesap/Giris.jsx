import React from 'react';
import logo from '@images/logo.png';
import emlak from '@images/emlak.jpg';
import logo2 from '@images/logo2.png';

const Giris = () => {
  return (
    <div className='flex min-h-screen select-none'>
      <img
        src={emlak}
        className='absolute right-0 top-0 h-full w-full flex-none opacity-5'
        alt='Emlak Arka Planı'
      />
      <div className='flex w-full flex-col items-center justify-center gap-3 bg-black'>
        <img src={logo} alt='Logo' className='w-32' />
        <div className='flex w-full flex-col items-center gap-1 pb-20'>
          <p className='text-3xl font-semibold text-yellow-500'>Üyelik</p>
          <p className='text-md font-medium text-gray-400'>Giriş Yap</p>
          <form className='z-50 mt-5 flex w-full flex-col items-center justify-center gap-1'>
            <input
              autoFocus
              type='email'
              placeholder='E-Posta'
              className='z-50 w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-yellow-400 outline-none ring-yellow-600 duration-300 focus:ring-2'
            />
            <input
              type='password'
              placeholder='Şifre'
              className='mt-2 w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-yellow-400 outline-none ring-yellow-600 duration-300 focus:ring-2'
            />
            <button className='mt-4 w-80 rounded-xl bg-yellow-300 py-2 font-semibold text-black'>
              Giriş Yap
            </button>
          </form>
          <img src={logo2} alt='Kürkaya Yazılım' className='absolute bottom-5 w-24' />
        </div>
      </div>
    </div>
  );
};

export default Giris;
