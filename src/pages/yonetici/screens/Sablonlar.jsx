import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Sablonlar = () => {
  const [sablonlar, setSablonlar] = useState([]);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [adres, setAdres] = useState('');
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast.success('Şablon başarıyla silindi');
    } catch (error) {
      toast.error('Şablon silinirken hata oluştu');
    }
  };

  const handleUpdate = async () => {
    if (editId) {
      try {
        const sablonRef = doc(db, 'sablonlar', editId);
        await updateDoc(sablonRef, { baslik, aciklama, adres });
        setBaslik('');
        setAciklama('');
        setAdres('');
        setEditId(null);
        setIsModalOpen(false);
        fetchSablonlar();
        toast.success('Şablon başarıyla güncellendi');
      } catch (error) {
        toast.error('Şablon güncellenirken hata oluştu');
      }
    }
  };

  const handleEdit = (sablon) => {
    setEditId(sablon.id);
    setBaslik(sablon.baslik);
    setAciklama(sablon.aciklama);
    setAdres(sablon.adres);
    setIsModalOpen(true);
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
              className='flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-4 shadow-md'
              whileHover={{ scale: 1.03 }}
            >
              <div>
                <h3 className='text-clip text-lg font-semibold'>{sablon.baslik}</h3>
                <p className='text-center text-sm text-gray-500'>{sablon.aciklama}</p>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleEdit(sablon)}
                  className='flex items-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600'
                >
                  <FaEdit className='mr-2' /> Düzenle
                </button>
                <button
                  onClick={() => handleDelete(sablon.id)}
                  className='flex items-center rounded bg-red-500 p-2 text-white hover:bg-red-600'
                >
                  <FaTrash className='mr-2' /> Kaldır
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-lg rounded-lg bg-white p-6'>
            <h3 className='mb-4 text-xl font-semibold'>Şablonu Düzenle</h3>
            <input
              type='text'
              placeholder='Başlık'
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className='mb-3 w-full rounded-md border p-2'
            />
            <textarea
              placeholder='Açıklama'
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className='mb-3 w-full rounded-md border p-2'
            />
            <input
              type='text'
              placeholder='Adres'
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              className='mb-3 w-full rounded-md border p-2'
            />
            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='rounded bg-gray-500 p-2 text-white'
              >
                İptal
              </button>
              <button onClick={handleUpdate} className='rounded bg-green-600 p-2 text-white'>
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sablonlar;
