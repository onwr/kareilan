import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import logo from '@images/logo.png';
import logo2 from '@images/logo2.png';

const Sidebar = ({ screen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownState, setDropdownState] = useState({});

  const toggleDropdown = (name) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return (
    <div className='relative'>
      <button
        className='absolute left-4 top-4 z-50'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <RxHamburgerMenu className='text-3xl text-black' />
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className='fixed inset-0 z-40 flex flex-col bg-white shadow-lg md:relative md:inset-auto md:w-64 md:shadow-none'
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className='mt-5 flex justify-center'>
              <img
                src={logo}
                alt='Logo'
                className='w-24 cursor-pointer'
                onClick={() => screen(0)}
              />
            </div>

            <div className='mt-8 space-y-4 px-4'>
              {[
                {
                  label: 'Kullanıcı Yönetimi',
                  items: [
                    { label: 'Kullanıcı İşlemleri', action: () => screen(0) },
                    { label: 'Kullanıcılar', action: () => screen(7) },
                    { label: 'Kullanıcı Oluştur', action: () => screen(8) },
                  ],
                },
                {
                  label: 'Firma ve Portallar',
                  items: [
                    { label: 'Oluştur', action: () => screen(3) },
                    { label: 'Firma ve Portallar', action: () => screen(4) },
                  ],
                },
                {
                  label: 'Şablonlar',
                  items: [
                    { label: 'Yeni Şablon', action: () => screen(1) },
                    { label: 'Kategori Oluştur', action: () => screen(9) },
                    { label: 'Şablonlar', action: () => screen(2) },
                  ],
                },
                {
                  label: 'Ödeme Yönetimi',
                  items: [
                    { label: 'Ödeme Yöntemi Ekle', action: () => screen(5) },
                    { label: 'İlan Fiyatları', action: () => screen(10) },
                    {
                      label: 'Aktif Ödeme Yöntemleri',
                      action: () => screen(6),
                    },
                  ],
                },
                {
                  label: 'Sözleşmeler',
                  items: [{ label: 'Kullanıcı Sözleşmesi', action: () => screen(11) }],
                },
                {
                  label: 'Nasıl Kullanılır',
                  items: [{ label: 'Videolar', action: () => screen(12) }],
                },
              ].map((menu, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleDropdown(menu.label)}
                    className='flex w-full items-center justify-between rounded-lg bg-yellow-500 px-4 py-2 text-white'
                  >
                    <span>{menu.label}</span>
                    {dropdownState[menu.label] ? <FaArrowUp /> : <FaArrowDown />}
                  </button>

                  <AnimatePresence>
                    {dropdownState[menu.label] && (
                      <motion.div
                        className='overflow-hidden rounded-lg bg-gray-100 shadow-lg'
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        variants={dropdownVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className='flex flex-col'>
                          {menu.items.map((item, idx) => (
                            <li key={idx}>
                              <button
                                onClick={item.action}
                                className='block w-full px-4 py-2 hover:bg-gray-200'
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className='mt-auto bg-black p-4 md:hidden'>
              <img src={logo2} alt='Kürkaya Yazılım' className='mx-auto w-24' />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
