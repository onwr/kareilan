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
import { FaDownload } from 'react-icons/fa6';

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
            const ilanSnapshot = await getDocs(ilanRef);

            let aktifAfisSayisi = 0;
            ilanSnapshot.forEach((ilanDoc) => {
              const ilanData = ilanDoc.data();
              if (ilanData.durum === true) {
                aktifAfisSayisi++;
              }
            });

            userData.aktifAfisMiktar = aktifAfisSayisi;
            userData.afisMiktar = ilanSnapshot.size;

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

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('tr-TR', options);
  };

  const downloadCSV = () => {
    const csvRows = [];
    const headers = [
      'F. Kod',
      'Firma Adi',
      'Kullanici Adi',
      'Ad',
      'Telefon',
      'E-Posta',
      'Afiş Miktar',
      'Durum',
      'Kurumsal Hesap',
      'Oluşturma Tarihi',
    ];

    csvRows.push(headers.join(';'));

    kullanicilar.forEach((kullanici) => {
      const rowData = [
        kullanici.fKod || '-',
        kullanici.firma || '-',
        kullanici.slug || '-',
        kullanici.ad || '-',
        kullanici.gsm || '-',
        kullanici.email || '-',
        kullanici.afisMiktar || 0,
        kullanici.durum ? 'Aktif' : 'Pasif',
        kullanici.kurumsal ? 'Kurumsal hesap' : 'Pasif',
        kullanici.olusturmaTarih ? formatDate(kullanici.olusturmaTarih) : '-',
      ];
      csvRows.push(rowData.join(';'));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'kullanicilar.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAfis = async (kulId, ad) => {
    try {
      const afisRef = collection(doc(db, 'kullanicilar', kulId), 'ilan');
      const afisSnapshot = await getDocs(afisRef);

      const csvRows = [];
      const headers = ['Afiş Kodu', 'Afiş Başlığı', 'Oluşturma Tarihi', 'Bitiş Tarihi'];
      csvRows.push(headers.join(';'));

      afisSnapshot.docs.forEach((doc) => {
        const afisData = doc.data();

        const formatDate = (timestamp) => {
          if (!timestamp) return '-';
          const date = timestamp.toDate();
          return new Intl.DateTimeFormat('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(date);
        };

        const rowData = [
          afisData.docId,
          afisData.baslik || '-',
          formatDate(afisData.olusturmaTarih),
          formatDate(afisData.bitisTarih),
        ];
        csvRows.push(rowData.join(';'));
      });

      const csvContent = '\uFEFF' + csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `kullanici_${ad}_afisler.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Kullanıcı ilanları başarıyla indirildi.');
    } catch (error) {
      console.error('İlanlar çekilirken hata oluştu:', error);
      toast.error('Kullanıcı ilanları çekilemedi.');
    }
  };

  const downloadCSVTopluAfis = async () => {
    try {
      const kulDoc = collection(db, 'kullanicilar');
      const kulSnap = await getDocs(kulDoc);
      const rows = [];
      const headers = [
        'Kullanıcı Adı',
        'İlan Kodu',
        'İlan Başlığı',
        'Oluşturma Tarihi',
        'Bitiş Tarihi',
      ];
      rows.push(headers.join(';'));

      for (const userDoc of kulSnap.docs) {
        const kulSlug = userDoc.data().slug || '-';

        const ilanRef = collection(userDoc.ref, 'ilan');
        const ilanSnap = await getDocs(ilanRef);

        ilanSnap.forEach((ilanDoc) => {
          const ilanData = ilanDoc.data();

          const formatDate = (timestamp) => {
            if (!timestamp) return '-';
            const date = timestamp.toDate();
            return new Intl.DateTimeFormat('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).format(date);
          };

          const rowData = [
            kulSlug,
            ilanData.docId,
            ilanData.baslik || '-',
            formatDate(ilanData.olusturmaTarih),
            formatDate(ilanData.bitisTarih),
          ];
          rows.push(rowData.join(';'));
        });
      }

      const csvContent = '\uFEFF' + rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `toplu_afisler.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Tüm ilanlar başarıyla indirildi.');
    } catch (error) {
      console.error('Veriler alınırken hata oluştu:', error);
      toast.error('Afiş bilgileri alınamadı.');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='mb-6 text-center text-2xl font-bold text-gray-800'>Firma Listesi</h2>
      <button
        onClick={downloadCSV}
        className='mb-2 mr-1 rounded-md bg-yellow-500 px-5 py-1 font-semibold text-white duration-300 hover:bg-yellow-600'
      >
        CSV İndir
      </button>
      <button
        onClick={downloadCSVTopluAfis}
        className='mb-2 rounded-md bg-indigo-500 px-5 py-1 font-semibold text-white duration-300 hover:bg-indigo-600'
      >
        Afiş CSV İndir
      </button>
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
              <th className='px-6 py-3 text-left'>Aktif Afiş</th>
              <th className='px-6 py-3 text-left'>Oluşturma Tarihi</th>
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
                  <td className='px-6 py-4'>{kullanici.aktifAfisMiktar || 0}</td>
                  <td className='px-6 py-4'>
                    {kullanici.olusturmaTarih ? formatDate(kullanici.olusturmaTarih) : 0}
                  </td>
                  <td className='flex items-center justify-center gap-2 px-6 py-4 text-center'>
                    <button
                      className='rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600'
                      onClick={() => setSelectedKullanici(kullanici)}
                    >
                      Daha Fazla
                    </button>
                    <button
                      className='rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600'
                      onClick={() => handleDelete(kullanici.id)}
                    >
                      Sil
                    </button>
                    <button
                      className='rounded bg-yellow-500 px-2 py-2 text-white hover:bg-yellow-600'
                      onClick={() => handleDownloadAfis(kullanici.id, kullanici.ad)}
                    >
                      <FaDownload />
                    </button>{' '}
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
