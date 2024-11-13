import React from 'react';
import kurkayayazilimlogo from '@images/logo2.png';

const Footer = () => {
  return (
    <footer className='border-t border-gray-700 bg-black py-10 pt-6 text-gray-200'>
      <div className='container mx-auto flex flex-col items-center justify-between md:flex-row'>
        <p className='text-sm'>&copy; {new Date().getFullYear()} Kareilan. Tüm hakları saklıdır.</p>
        <div className='mt-10 flex items-center md:mt-0'>
          <img src={kurkayayazilimlogo} alt='Kürkaya Yazılım' className='h-10' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
