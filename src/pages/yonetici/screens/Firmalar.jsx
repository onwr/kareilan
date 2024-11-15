import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getCountFromServer,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Firmalar = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKullanici, setSelectedKullanici] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = collection(db, 'kullanicilar');
        const querySnapshot = await getDocs(docRef);

        const kullaniciListesi = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = { id: doc.id, ...doc.data() };

            const ilanRef = collection(doc.ref, 'ilan');
            const ilanSnapshot = await getCountFromServer(ilanRef);

            userData.afisMiktar = ilanSnapshot.data().count;

            return userData;
          })
        );

        setKullanicilar(kullaniciListesi);
        setLoading(false);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
      }
    };

    veriCek();
  }, []);

  const closeModal = () => {
    setSelectedKullanici(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, 'kullanicilar', id);

      const ilanRef = collection(docRef, 'ilan');
      const ilanSnapshot = await getDocs(ilanRef);

      const ilanDeletePromises = ilanSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(ilanDeletePromises);

      await deleteDoc(docRef);

      setKullanicilar(kullanicilar.filter((kullanici) => kullanici.id !== id));
      toast.success('Kullanıcı ve ilgili ilanlar başarıyla silindi.');
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (kullanici) => {
    setEditForm(kullanici);
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { id, ...updatedData } = editForm;
    try {
      const docRef = doc(db, 'kullanicilar', id);
      await updateDoc(docRef, updatedData);

      setKullanicilar((prev) =>
        prev.map((kullanici) =>
          kullanici.id === id ? { ...kullanici, ...updatedData } : kullanici
        )
      );
      toast.success('Kullanıcı bilgileri başarıyla güncellendi.');
      closeModal();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Güncelleme sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='mb-6 text-center text-2xl font-bold text-gray-800'>Firma Listesi</h2>

      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto overflow-hidden rounded-lg border bg-white shadow-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='px-6 py-3 text-left'>F. Kod</th>
              <th className='px-6 py-3 text-left'>Firma Adı</th>
              <th className='px-6 py-3 text-left'>Ad</th>
              <th className='px-6 py-3 text-left'>Telefon</th>
              <th className='px-6 py-3 text-left'>E-Posta</th>
              <th className='px-6 py-3 text-left'>Afiş Miktar</th>
              <th className='px-6 py-3 text-center'>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {kullanicilar.map((kullanici) => (
                <motion.tr
                  key={kullanici.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>{kullanici.fKod || '-'}</td>
                  <td className='px-6 py-4'>{kullanici.firma || '-'}</td>
                  <td className='px-6 py-4'>{kullanici.ad || '-'}</td>
                  <td className='px-6 py-4'>{kullanici.gsm || '-'}</td>
                  <td className='px-6 py-4'>{kullanici.email || '-'}</td>
                  <td className='px-6 py-4'>{kullanici.afisMiktar || 0}</td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      className='mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                      onClick={() => setSelectedKullanici(kullanici)}
                    >
                      Daha Fazla
                    </button>
                    <button
                      className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
                      onClick={() => handleDelete(kullanici.id)}
                    >
                      Sil
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedKullanici && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className='w-full max-w-lg rounded-lg bg-white p-6 shadow-lg'
            >
              <h3 className='mb-4 text-lg font-bold'>
                {isEditing ? 'Kullanıcıyı Düzenle' : 'Kullanıcı Detayları'}
              </h3>
              {!isEditing ? (
                <ul className='mb-4'>
                  {Object.entries(selectedKullanici).map(([key, value]) => (
                    <li key={key} className='mb-2 flex justify-between'>
                      <strong className='capitalize'>{key}:</strong>
                      <span>{value?.toString() || '-'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='grid grid-cols-2 gap-2'>
                  {Object.keys(editForm).map((key) => (
                    <div key={key} className='mb-2'>
                      <label className='block text-sm font-medium'>{key}</label>
                      <input
                        type='text'
                        name={key}
                        value={editForm[key]}
                        onChange={handleFormChange}
                        className='mt-1 w-full rounded border px-3 py-2'
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleSave}
                    className='mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'
                  >
                    Kaydet
                  </button>
                </div>
              )}
              <div className='mt-4 flex justify-end gap-2'>
                {!isEditing && (
                  <button
                    className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
                    onClick={() => handleEdit(selectedKullanici)}
                  >
                    Düzenle
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Firmalar;
