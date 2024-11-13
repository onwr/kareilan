import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';

const OdemeYontemleri = () => {
  const [odemeYontemleri, setOdemeYontemleri] = useState([]);

  const fetchOdemeYontemleri = async () => {
    try {
      const odemeRef = collection(db, 'odemeYontem');
      const querySnapshot = await getDocs(odemeRef);
      const odemeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOdemeYontemleri(odemeList);
    } catch (error) {
      console.error('Ödeme yöntemleri alınırken hata:', error);
    }
  };

  useEffect(() => {
    fetchOdemeYontemleri();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bu ödeme yöntemini silmek istediğinize emin misiniz?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'odemeYontem', id));
        toast.success('Ödeme yöntemi başarıyla silindi!');
        setOdemeYontemleri((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Ödeme yöntemi silinirken hata:', error);
      }
    }
  };

  return (
    <div className='container max-w-screen-lg rounded-xl border border-black/10 bg-white p-5'>
      <h2 className='text-lg font-bold'>Ödeme Yöntemleri</h2>
      {odemeYontemleri.length === 0 ? (
        <p className='mt-5'>Henüz ödeme yöntemi eklenmedi.</p>
      ) : (
        <ul className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-2'>
          {odemeYontemleri.map((odeme) => (
            <li
              key={odeme.id}
              className='mb-4 flex items-center justify-between rounded-lg bg-neutral-100 p-4'
            >
              <div>
                {odeme.link && <img src={odeme.link} className='w-20' />}
                <p className='mt-2 font-medium'>{odeme.adres}</p>
              </div>
              <button
                onClick={() => handleDelete(odeme.id)}
                className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OdemeYontemleri;
