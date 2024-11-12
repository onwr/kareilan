import React, { useState } from 'react';
import logo from '@images/logo.png';
import logo2 from '@images/logo2.png';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ screen }) => {
  const [isKullaniciDropdownOpen, setIsKullaniciDropdownOpen] = useState(false);
  const [isKisitDropdownOpen, setIsKisitDropdownOpen] = useState(false);
  const [isSablonDropdownOpen, setIsSablonDropdownOpen] = useState(false);
  const [isOdemeDropDown, setIsOdemeDropDown] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return (
    <div className='relative flex w-1/6 flex-col items-center border-r shadow-2xl'>
      <img src={logo} className='mt-5 w-24' alt='Logo' />

      <div className='mt-8 w-full px-4'>
        <button
          onClick={() => setIsKullaniciDropdownOpen(!isKullaniciDropdownOpen)}
          className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
        >
          <span>Kullanıcı Yönetimi</span>
          {isKullaniciDropdownOpen ? <FaArrowUp /> : <FaArrowDown />}
        </button>

        <AnimatePresence>
          {isKullaniciDropdownOpen && (
            <motion.div
              className='overflow-hidden rounded bg-white shadow-lg'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={dropdownVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ul className='flex flex-col'>
                <li className='border-b'>
                  <button
                    onClick={() => screen(0)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Kullanıcı İşlemleri
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mt-5 w-full px-4'>
        <button
          onClick={() => setIsKisitDropdownOpen(!isKisitDropdownOpen)}
          className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
        >
          <span>Firma ve Portallar</span>
          {isKisitDropdownOpen ? <FaArrowUp /> : <FaArrowDown />}
        </button>

        <AnimatePresence>
          {isKisitDropdownOpen && (
            <motion.div
              className='overflow-hidden rounded bg-white shadow-lg'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={dropdownVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ul className='flex flex-col'>
                <li className='border-b'>
                  <button
                    onClick={() => screen(3)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Oluştur
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => screen(4)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Firma ve Portallar
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mt-5 w-full px-4'>
        <button
          onClick={() => setIsSablonDropdownOpen(!isSablonDropdownOpen)}
          className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
        >
          <span>Şablonlar</span>
          {isSablonDropdownOpen ? <FaArrowUp /> : <FaArrowDown />}
        </button>

        <AnimatePresence>
          {isSablonDropdownOpen && (
            <motion.div
              className='overflow-hidden rounded bg-white shadow-lg'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={dropdownVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ul className='flex flex-col'>
                <li className='border-b'>
                  <button
                    onClick={() => screen(1)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Yeni Şablon
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => screen(2)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Şablonlar
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mt-5 w-full px-4'>
        <button
          onClick={() => setIsOdemeDropDown(!isOdemeDropDown)}
          className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
        >
          <span>Ödeme Yönetimi</span>
          {isOdemeDropDown ? <FaArrowUp /> : <FaArrowDown />}
        </button>

        <AnimatePresence>
          {isOdemeDropDown && (
            <motion.div
              className='overflow-hidden rounded bg-white shadow-lg'
              initial='hidden'
              animate='visible'
              exit='hidden'
              variants={dropdownVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ul className='flex flex-col'>
                <li className='border-b'>
                  <button
                    onClick={() => screen(5)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Ödeme Yöntemi Ekle
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => screen(6)}
                    className='block w-full px-4 py-2 hover:bg-gray-100'
                  >
                    Aktif Ödeme Yöntemleri
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='absolute bottom-0 w-full border-t bg-black px-5 py-2'>
        <img src={logo2} className='mx-auto w-24' alt='Kürkaya Yazılım' />
      </div>
    </div>
  );
};

export default Sidebar;
