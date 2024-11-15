import React from 'react';
import logo from '@images/logo.png';
import { FaRightLong } from 'react-icons/fa6';
import { IoGitNetworkSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { LuLogIn } from 'react-icons/lu';
import emlakBg from '@images/emlak.jpg';
import { AiFillInstagram, AiOutlineYoutube } from 'react-icons/ai';

const Hero = () => {
  return (
    <div className='relative flex w-full flex-col items-center justify-center bg-gradient-to-b from-yellow-200 to-white py-10 lg:rounded-b-[10vh] lg:shadow-2xl'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url(${emlakBg})`,
          opacity: 0.1,
        }}
      ></div>

      <motion.img
        src={logo}
        alt='Kareilan Anasayfa'
        className='mx-auto w-32'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

      <p className='mt-1 text-center text-lg'>kareilan.com</p>

      <motion.h1
        className='mt-3 text-center text-2xl font-medium md:text-3xl lg:mt-5 lg:text-4xl xl:text-5xl'
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        Az Alanda Çok Söz
      </motion.h1>

      <motion.p
        className='mt-2 max-w-xs text-center text-xs md:max-w-md md:text-base lg:text-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        Emlak afişlerinizi QR kod ile internete bağlayın, daha fazla detay paylaşın.
      </motion.p>

      <div className='z-50 mt-5 flex flex-col items-center justify-center gap-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <motion.a
            className='flex cursor-pointer items-center gap-3 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black duration-300 hover:bg-yellow-500/80'
            initial={{ opacity: 0, x: 0 }}
            href='/hesap/giris'
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Giriş Yap
            <LuLogIn />
          </motion.a>
          <motion.a
            className='flex cursor-pointer items-center gap-3 rounded-lg bg-black px-4 py-2 font-semibold text-yellow-500 duration-300 hover:bg-black/80'
            initial={{ opacity: 0, x: 0 }}
            href='/hesap/olustur'
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hemen Üye Ol
            <FaRightLong />
          </motion.a>
        </div>

        <motion.a
          href='#nasilcalisir'
          className='z-50 flex items-center gap-3 rounded-lg border border-yellow-500 bg-white px-4 py-2 font-semibold text-black duration-300 hover:bg-black/20'
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Nasıl Çalışır
          <IoGitNetworkSharp />
        </motion.a>
      </div>

      <div className='z-50 my-3 flex items-center gap-5'>
        <motion.a
          href='https://www.youtube.com/@kareilan'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ duration: 0.5 }}
        >
          <AiOutlineYoutube className='rounded-lg bg-red-500 p-1 text-4xl text-white' />
        </motion.a>
        <motion.a
          href='https://www.instagram.com/karekodilan'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2, rotate: -10 }}
          transition={{ duration: 0.5 }}
        >
          <AiFillInstagram className='rounded-lg bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 p-1 text-4xl text-white' />
        </motion.a>
      </div>
    </div>
  );
};

export default Hero;
