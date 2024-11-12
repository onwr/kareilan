import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Sablonlar = () => {
  const [sablonlar, setSablonlar] = useState([]);

  const fetchSablonlar = async () => {
    try {
      const sablonCollection = collection(db, 'sablonlar');
      const sablonSnapshot = await getDocs(sablonCollection);
      const sablonList = sablonSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSablonlar(sablonList);
    } catch (error) {
      toast.error('Şablonlar çekilirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchSablonlar();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'sablonlar', id));
      setSablonlar(sablonlar.filter((sablon) => sablon.id !== id));
    } catch (error) {
      console.error('Şablon silinirken hata oluştu:', error);
    }
  };

  return (
    <div className='container mx-auto w-full p-5'>
      <h2 className='mb-5 text-2xl font-bold'>Şablonlar</h2>
      {sablonlar.length === 0 ? (
        <p>Henüz eklenmiş şablon bulunmuyor.</p>
      ) : (
        <motion.div
          className='grid grid-cols-1 gap-4 rounded-xl bg-white p-5 md:grid-cols-2 lg:grid-cols-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sablonlar.map((sablon) => (
            <motion.div
              key={sablon.id}
              className='flex items-center justify-between rounded-lg bg-neutral-100 p-4 shadow-md'
              whileHover={{ scale: 1.03 }}
            >
              <div>
                <h3 className='text-lg font-semibold'>{sablon.baslik}</h3>
                <p className='text-sm text-gray-500'>{sablon.aciklama}</p>
              </div>
              <button
                onClick={() => handleDelete(sablon.id)}
                className='flex items-center rounded bg-red-500 p-2 text-white hover:bg-red-600'
              >
                <FaTrash className='mr-2' /> Kaldır
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Sablonlar;
