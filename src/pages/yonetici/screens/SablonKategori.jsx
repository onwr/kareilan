import React, { useState, useEffect } from 'react';
import { db } from 'src/db/Firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SablonKategori = () => {
  const [firmaAdi, setFirmaAdi] = useState('');
  const [loading, setLoading] = useState(false);
  const [kategoriList, setKategoriList] = useState([]);

  const fetchCategories = async () => {
    try {
      const docRef = doc(db, 'sablonlar', 'kategoriler');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const kategoriListData = existingData.kategoriList || [];
        setKategoriList(kategoriListData);
      } else {
        toast.error('Kategoriler dökümanı bulunamadı.');
      }
    } catch (error) {
      console.error('Veriler alınırken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddFirma = async (e) => {
    e.preventDefault();

    if (!firmaAdi.trim()) {
      toast.error('Lütfen bir firma adı girin.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'sablonlar', 'kategoriler');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const kategoriListData = Array.isArray(existingData.kategoriList)
          ? existingData.kategoriList
          : [];

        const yeniFirma = { ad: firmaAdi };

        const updatedCategories = {
          ...existingData,
          kategoriList: [...kategoriListData, yeniFirma],
        };

        await updateDoc(docRef, updatedCategories);
        toast.success('Yeni firma başarıyla eklendi!');

        setKategoriList([...kategoriListData, yeniFirma]);

        setFirmaAdi('');
      } else {
        await setDoc(docRef, { kategoriList: [{ ad: firmaAdi }] });
        toast.success('Yeni firma başarıyla eklendi!');
        setKategoriList([{ ad: firmaAdi }]);
        setFirmaAdi('');
      }
    } catch (error) {
      console.error('Firma eklenirken hata oluştu:', error);
      toast.error('Firma eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFirma = async (index) => {
    try {
      const docRef = doc(db, 'sablonlar', 'kategoriler');
      const filteredList = kategoriList.filter((_, i) => i !== index);
      await updateDoc(docRef, { kategoriList: filteredList });
      setKategoriList(filteredList);
      toast.success('Firma başarıyla silindi!');
    } catch (error) {
      console.error('Firma silinirken hata oluştu:', error);
      toast.error('Firma silinemedi.');
    }
  };

  return (
    <div className='flex w-full max-w-screen-lg flex-col'>
      <div className='container mx-auto rounded-lg bg-white p-5 md:border'>
        <h2 className='mb-5 text-2xl font-semibold'>Yeni Firma Ekle</h2>

        <form onSubmit={handleAddFirma} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Firma Adı</label>
            <input
              type='text'
              value={firmaAdi}
              onChange={(e) => setFirmaAdi(e.target.value)}
              placeholder='Firma Adı Girin'
              className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600'
            disabled={loading}
          >
            {loading ? 'Ekleniyor...' : 'Firma Ekle'}
          </button>
        </form>
      </div>

      <div className='container mt-5 rounded-lg bg-white p-5 md:border'>
        <h2 className='mb-5 text-2xl font-semibold'>Firma Listesi</h2>
        <div className='grid grid-cols-3 gap-4'>
          {kategoriList.map((firma, index) => (
            <div
              key={index}
              className='flex flex-col items-center justify-between rounded bg-gray-100 p-3 shadow'
            >
              <span className='font-semibold'>{firma.ad}</span>
              <button
                onClick={() => handleDeleteFirma(index)}
                className='mt-3 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600'
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SablonKategori;
