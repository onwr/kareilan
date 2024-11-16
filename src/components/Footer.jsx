import React from 'react';
import kurkayayazilimlogo from '@images/logo2.png';
import { AiFillInstagram, AiOutlineYoutube } from 'react-icons/ai';

const Footer = () => {
  return (
    <footer className='border-t border-gray-700 bg-black py-10 pt-6 text-gray-200'>
      <div className='container mx-auto flex flex-col items-center justify-between md:flex-row'>
        <div className='z-50 my-3 flex flex-1 items-center gap-5'>
          <a href='https://www.youtube.com/@kareilan'>
            <AiOutlineYoutube className='rounded-lg bg-red-500 p-1 text-4xl text-white' />
          </a>
          <a href='https://www.instagram.com/karekodilan'>
            <AiFillInstagram className='rounded-lg bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 p-1 text-4xl text-white' />
          </a>
        </div>
        <p className='text-sm'>&copy; {new Date().getFullYear()} Kareilan. Tüm hakları saklıdır.</p>
        <div className='mt-10 flex flex-1 items-end justify-end md:mt-0'>
          <img src={kurkayayazilimlogo} alt='Kürkaya Yazılım' className='h-10' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
