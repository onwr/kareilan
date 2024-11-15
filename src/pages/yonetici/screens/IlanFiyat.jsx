import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const IlanFiyat = () => {
  const [fiyatlar, setFiyatlar] = useState([]);
  const [adet, setAdet] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchFiyatlar = async () => {
      try {
        const fiyatRef = collection(db, 'fiyatlandirma');
        const snapshot = await getDocs(fiyatRef);
        const fiyatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiyatlar(fiyatData);
      } catch (error) {
        console.error('Fiyatlar alınırken hata oluştu:', error);
        toast.error('Fiyatlar alınırken hata oluştu');
      }
    };

    fetchFiyatlar();
  }, []);

  const handleAddFiyat = async () => {
    if (adet && fiyat) {
      try {
        const fiyatRef = collection(db, 'fiyatlandirma');
        await addDoc(fiyatRef, { adet, fiyat });
        setAdet('');
        setFiyat('');
        toast.success('Yeni fiyat eklendi');
        fetchFiyatlar();
      } catch (error) {
        console.error('Fiyat eklenirken hata oluştu:', error);
        toast.error('Fiyat eklenirken hata oluştu');
      }
    } else {
      toast.warning('Adet ve fiyat alanlarını doldurun');
    }
  };

  const handleUpdateFiyat = async () => {
    if (editId && adet && fiyat) {
      try {
        const fiyatRef = doc(db, 'fiyatlandirma', editId);
        await updateDoc(fiyatRef, { adet, fiyat });
        setEditId(null);
        setAdet('');
        setFiyat('');
        toast.success('Fiyat güncellendi');
        fetchFiyatlar();
      } catch (error) {
        console.error('Fiyat güncellenirken hata oluştu:', error);
        toast.error('Fiyat güncellenirken hata oluştu');
      }
    } else {
      toast.warning('Fiyat ve adet alanlarını doldurun');
    }
  };

  // Fiyat silme
  const handleDeleteFiyat = async (id) => {
    try {
      const fiyatRef = doc(db, 'fiyatlandirma', id);
      await deleteDoc(fiyatRef);
      toast.success('Fiyat silindi');
      fetchFiyatlar();
    } catch (error) {
      console.error('Fiyat silinirken hata oluştu:', error);
      toast.error('Fiyat silinirken hata oluştu');
    }
  };

  // Fiyatları listele
  const renderFiyatlar = () => {
    return fiyatlar.map((fiyat) => (
      <motion.tr
        key={fiyat.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <td className='border-b px-4 py-2'>{fiyat.adet}</td>
        <td className='border-b px-4 py-2'>{fiyat.fiyat} ₺</td>
        <td className='border-b px-4 py-2'>
          <button
            onClick={() => {
              setAdet(fiyat.adet);
              setFiyat(fiyat.fiyat);
              setEditId(fiyat.id);
            }}
            className='text-yellow-600'
          >
            Güncelle
          </button>
          <button onClick={() => handleDeleteFiyat(fiyat.id)} className='ml-2 text-red-600'>
            Sil
          </button>
        </td>
      </motion.tr>
    ));
  };

  return (
    <div className='rounded-lg bg-white p-5 shadow-lg md:border'>
      <h2 className='mb-4 text-center text-2xl font-semibold'>İlan Fiyatları</h2>

      <div className='mb-4 flex flex-col md:flex-row'>
        <input
          type='number'
          placeholder='Adet'
          value={adet}
          onChange={(e) => setAdet(e.target.value)}
          className='mb-2 rounded-md border p-2 md:mb-0 md:mr-2'
        />
        <input
          type='number'
          placeholder='Fiyat (₺)'
          value={fiyat}
          onChange={(e) => setFiyat(e.target.value)}
          className='mb-2 rounded-md border p-2 md:mb-0 md:mr-2'
        />
        <button
          onClick={editId ? handleUpdateFiyat : handleAddFiyat}
          className='rounded-md bg-blue-600 p-2 text-white'
        >
          {editId ? 'Güncelle' : 'Ekle'}
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto'>
          <thead>
            <tr>
              <th className='border-b px-4 py-2 text-left'>Adet</th>
              <th className='border-b px-4 py-2 text-left'>Fiyat</th>
              <th className='border-b px-4 py-2 text-left'>Aksiyon</th>
            </tr>
          </thead>
          <tbody>{renderFiyatlar()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default IlanFiyat;
