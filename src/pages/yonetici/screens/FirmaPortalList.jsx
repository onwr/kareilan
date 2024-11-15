import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FirmaPortalList = () => {
  const [firmalar, setFirmalar] = useState([]);
  const [portallar, setPortallar] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFirm, setIsFirm] = useState(false);

  const fetchData = async () => {
    try {
      const firmaDocRef = doc(db, 'kisitlar', 'firma');
      const firmaSnapshot = await getDoc(firmaDocRef);
      const firmaData = firmaSnapshot.exists() ? firmaSnapshot.data().kisitlar : [];

      const portalDocRef = doc(db, 'kisitlar', 'portal');
      const portalSnapshot = await getDoc(portalDocRef);
      const portalData = portalSnapshot.exists() ? portalSnapshot.data().kisitlar : [];

      setFirmalar(firmaData);
      setPortallar(portalData);
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu.');
      console.error('Firestore Hatası:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (type, index) => {
    try {
      const updatedData = type === 'Firma' ? [...firmalar] : [...portallar];
      updatedData.splice(index, 1);

      if (type === 'Firma') {
        setFirmalar(updatedData);
        const firmaDocRef = doc(db, 'kisitlar', 'firma');
        await updateDoc(firmaDocRef, { kisitlar: updatedData });
      } else {
        setPortallar(updatedData);
        const portalDocRef = doc(db, 'kisitlar', 'portal');
        await updateDoc(portalDocRef, { kisitlar: updatedData });
      }

      toast.success(`${type} başarıyla kaldırıldı!`);
    } catch (error) {
      toast.error('Kaldırma işlemi sırasında bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleEdit = (item, isFirm) => {
    setSelectedItem(item);
    setIsFirm(isFirm);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedData = isFirm ? [...firmalar] : [...portallar];
      const index = updatedData.findIndex((i) => i.adi === selectedItem.adi);
      updatedData[index] = selectedItem;

      if (isFirm) {
        setFirmalar(updatedData);
        const firmaDocRef = doc(db, 'kisitlar', 'firma');
        await updateDoc(firmaDocRef, { kisitlar: updatedData });
      } else {
        setPortallar(updatedData);
        const portalDocRef = doc(db, 'kisitlar', 'portal');
        await updateDoc(portalDocRef, { kisitlar: updatedData });
      }

      toast.success('Başarıyla güncellendi!');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-4 text-3xl font-bold'>Firma ve Portal Listesi</h1>

      <div className='space-y-10'>
        <section>
          <h2 className='text-xl font-semibold text-blue-600'>Firmalar</h2>
          <div className='grid gap-5 sm:grid-cols-1 lg:grid-cols-3'>
            {firmalar.map((firma, index) => (
              <motion.div
                key={index}
                className='rounded-lg border bg-white p-4 shadow-md hover:shadow-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img src={firma.imageUrl} className='w-20' />
                <h3 className='font-bold'>{firma.adi}</h3>
                {firma.urlPatterns && (
                  <ul className='ml-4 list-disc'>
                    {firma.urlPatterns.map((url, idx) => (
                      <li key={idx} className='text-blue-500'>
                        <a href={url} target='_blank' rel='noopener noreferrer'>
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className='mt-4 flex space-x-2'>
                  <button
                    onClick={() => handleEdit(firma, true)}
                    className='rounded bg-yellow-500 px-4 py-2 text-white'
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleRemove('Firma', index)}
                    className='rounded bg-red-500 px-4 py-2 text-white'
                  >
                    Kaldır
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className='mt-5 text-xl font-semibold text-blue-600'>Portallar</h2>
          <div className='mt-2 grid gap-5 sm:grid-cols-1 lg:grid-cols-3'>
            {portallar.map((firma, index) => (
              <motion.div
                key={index}
                className='rounded-lg border bg-white p-4 shadow-md hover:shadow-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img src={firma.imageUrl} className='w-20' />
                <h3 className='font-bold'>{firma.adi}</h3>
                {firma.urlPatterns && (
                  <ul className='ml-4 list-disc'>
                    {firma.urlPatterns.map((url, idx) => (
                      <li key={idx} className='text-blue-500'>
                        <a href={url} target='_blank' rel='noopener noreferrer'>
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className='mt-4 flex space-x-2'>
                  <button
                    onClick={() => handleEdit(firma, false)}
                    className='rounded bg-yellow-500 px-4 py-2 text-white'
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleRemove('Portal', index)}
                    className='rounded bg-red-500 px-4 py-2 text-white'
                  >
                    Kaldır
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className='w-full max-w-lg rounded-lg bg-white p-6'
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h2 className='mb-4 text-2xl font-semibold'>Düzenle</h2>
                <input
                  type='text'
                  value={selectedItem?.adi || ''}
                  onChange={(e) => setSelectedItem({ ...selectedItem, adi: e.target.value })}
                  className='mb-4 w-full rounded border p-2'
                  placeholder='Adı'
                />
                <textarea
                  value={selectedItem?.urlPatterns.join('\n') || ''}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, urlPatterns: e.target.value.split('\n') })
                  }
                  className='mb-4 w-full rounded border p-2'
                  placeholder='URL Patterns (her satıra bir tane)'
                ></textarea>
                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='rounded bg-gray-500 px-4 py-2 text-white'
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className='rounded bg-green-500 px-4 py-2 text-white'
                  >
                    Kaydet
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FirmaPortalList;
