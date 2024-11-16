import React, { useState } from 'react';
import logo from '@images/logo.png';
import logo2 from '@images/logo2.png';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ screen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isKullaniciDropdownOpen, setIsKullaniciDropdownOpen] = useState(false);
  const [isKisitDropdownOpen, setIsKisitDropdownOpen] = useState(false);
  const [isSablonDropdownOpen, setIsSablonDropdownOpen] = useState(false);
  const [isOdemeDropDown, setIsOdemeDropDown] = useState(false);
  const [isSozlesmeDropDown, setIsSozlesmeDropDown] = useState(false);
  const [isEgitimVideolarDropDown, setIsEgitimVideolarDropDown] = useState(false);

  const navigate = useNavigate();

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return (
    <div className='relative flex flex-col items-center border-r shadow-2xl'>
      <button
        className='absolute left-4 top-4 md:hidden'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <RxHamburgerMenu className='text-3xl' />
      </button>

      <div className={`mt-5 w-full ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <img
          src={logo}
          onClick={() => navigate('/')}
          className='mx-auto mt-5 w-24 cursor-pointer'
          alt='Logo'
        />

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
                  <li className='border-b'>
                    <button
                      onClick={() => screen(7)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      Kullanıcılar
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => screen(8)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      Kullanıcı Oluştur
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
                  <li className='border-b'>
                    <button
                      onClick={() => screen(9)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      Kategori Oluştur
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
                  <li className='border-b'>
                    <button
                      onClick={() => screen(10)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      İlan Fiyatları
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

        <div className='mt-5 w-full px-4'>
          <button
            onClick={() => setIsSozlesmeDropDown(!isSozlesmeDropDown)}
            className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
          >
            <span>Sözleşmeler</span>
            {isSozlesmeDropDown ? <FaArrowUp /> : <FaArrowDown />}
          </button>

          <AnimatePresence>
            {isSozlesmeDropDown && (
              <motion.div
                className='overflow-hidden rounded bg-white shadow-lg'
                initial='hidden'
                animate='visible'
                exit='hidden'
                variants={dropdownVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ul className='flex flex-col'>
                  <li>
                    <button
                      onClick={() => screen(11)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      Kullanıcı Sözleşmesi
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='mt-5 w-full px-4'>
          <button
            onClick={() => setIsEgitimVideolarDropDown(!isEgitimVideolarDropDown)}
            className='flex w-full items-center justify-between rounded bg-yellow-500 px-4 py-2 font-semibold text-white hover:bg-yellow-600'
          >
            <span>Nasıl Kullanılır</span>
            {isEgitimVideolarDropDown ? <FaArrowUp /> : <FaArrowDown />}
          </button>

          <AnimatePresence>
            {isEgitimVideolarDropDown && (
              <motion.div
                className='overflow-hidden rounded bg-white shadow-lg'
                initial='hidden'
                animate='visible'
                exit='hidden'
                variants={dropdownVariants}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ul className='flex flex-col'>
                  <li>
                    <button
                      onClick={() => screen(12)}
                      className='block w-full px-4 py-2 hover:bg-gray-100'
                    >
                      Videolar
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
    </div>
  );
};

export default Sidebar;
