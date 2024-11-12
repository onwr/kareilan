import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from 'src/db/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { IoCloseCircleOutline } from 'react-icons/io5';

const OdemeModal = ({ isOpen, onClose }) => {
  const [odemeYontemleri, setOdemeYontemleri] = useState([]);

  useEffect(() => {
    const fetchOdemeYontemleri = async () => {
      try {
        const odemeRef = collection(db, 'odemeYontem');
        const snapshot = await getDocs(odemeRef);
        const yontemler = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOdemeYontemleri(yontemler);
        console.log(yontemler);
      } catch (error) {
        console.error('Ödeme yöntemleri alınamadı:', error);
      }
    };

    if (isOpen) {
      fetchOdemeYontemleri();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === 'modal-background') {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      id='modal-background'
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='relative max-w-xl overflow-y-auto rounded-lg bg-white p-8'
      >
        <button onClick={onClose} className='absolute right-4 top-4 rounded-full'>
          <IoCloseCircleOutline />
        </button>

        <h2 className='mb-5 text-center text-xl font-bold'>Ödeme Yöntemleri</h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {odemeYontemleri.map((odeme) => (
            <motion.a
              key={odeme.id}
              whileHover={{ scale: 1.05 }}
              className='cursor-pointer overflow-hidden'
              href={odeme.adres}
            >
              <img
                src={odeme.link}
                className='mx-auto h-40 w-auto rounded-xl border bg-cover object-cover'
              />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OdemeModal;
