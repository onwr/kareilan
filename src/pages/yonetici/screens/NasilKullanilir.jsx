import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const NasilKullanilir = () => {
  const [afisOlusturUrl, setAfisOlusturUrl] = useState('');
  const [profilUrl, setProfilUrl] = useState('');
  const [afisDuzenleUrl, setAfisDuzenleUrl] = useState('');
  const [sablonlarUrl, setSablonlarUrl] = useState('');
  const [anasayfaUrl, setAnasayfaUrl] = useState('');
  const [butonMetni, setButonMetni] = useState('');
  const [butonAktif, setButonAktif] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'nasilkullanilir', 'video');
        const snapDoc = await getDoc(docRef);

        if (snapDoc.exists()) {
          const data = snapDoc.data();
          setAfisOlusturUrl(data.afisolustur || '');
          setProfilUrl(data.profil || '');
          setAfisDuzenleUrl(data.afisduzenle || '');
          setSablonlarUrl(data.sablonlar || '');
          setAnasayfaUrl(data.anasayfatanitim || '');
          setButonMetni(data.anasayfaVideoButonMetni || 'Tanıtım Videosu');
          setButonAktif(data.anasayfaVideoButonAktif || false);
        }
      } catch (error) {
        console.error('Veri çekilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleUpdate = async (field, value) => {
    try {
      const docRef = doc(db, 'nasilkullanilir', 'video');
      await updateDoc(docRef, { [field]: value });
      toast.success('Bilgiler başarıyla güncellendi!');
    } catch (error) {
      console.error('Güncelleme sırasında hata oluştu:', error);
    }
  };

  if (loading) {
    return <p>Veriler yükleniyor...</p>;
  }

  return (
    <div className='w-full max-w-3xl rounded-lg bg-white p-5 md:border'>
      <p className='text-xl font-semibold'>Kullanım Videoları</p>

      <div className='mt-4'>
        <label className='mb-2 block'>
          Afiş Oluşturma Video URL:
          <input
            type='text'
            value={afisOlusturUrl}
            onChange={(e) => setAfisOlusturUrl(e.target.value)}
            autoFocus
            className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
          />
          <button
            onClick={() => handleUpdate('afisolustur', afisOlusturUrl)}
            className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Güncelle
          </button>
        </label>

        <label className='mb-2 block'>
          Profil Yönetimi Video URL:
          <input
            type='text'
            value={profilUrl}
            onChange={(e) => setProfilUrl(e.target.value)}
            className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
          />
          <button
            onClick={() => handleUpdate('profil', profilUrl)}
            className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Güncelle
          </button>
        </label>

        <label className='mb-2 block'>
          Afiş Düzenleme Video URL:
          <input
            type='text'
            value={afisDuzenleUrl}
            onChange={(e) => setAfisDuzenleUrl(e.target.value)}
            className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
          />
          <button
            onClick={() => handleUpdate('afisduzenle', afisDuzenleUrl)}
            className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Güncelle
          </button>
        </label>

        <label className='mb-2 block'>
          Şablonlar Video URL:
          <input
            type='text'
            value={sablonlarUrl}
            onChange={(e) => setSablonlarUrl(e.target.value)}
            className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
          />
          <button
            onClick={() => handleUpdate('sablonlar', sablonlarUrl)}
            className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Güncelle
          </button>
        </label>

        <div className='rounded-md border bg-neutral-100 p-2'>
          <label className='mb-2 block'>
            Anasayfa Video URL:
            <input
              type='text'
              value={sablonlarUrl}
              onChange={(e) => setSablonlarUrl(e.target.value)}
              className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
            />
            <button
              onClick={() => handleUpdate('anasayfatanitim', sablonlarUrl)}
              className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Güncelle
            </button>
          </label>

          <label className='mb-2 block'>
            Buton Metni:
            <input
              type='text'
              value={butonMetni}
              onChange={(e) => setButonMetni(e.target.value)}
              className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none ring-yellow-300 duration-300 focus:ring-1'
            />
            <button
              onClick={() => handleUpdate('anasayfaVideoButonMetni', butonMetni)}
              className='mt-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600'
            >
              Buton Metnini Güncelle
            </button>
          </label>

          <label className='mb-2 block'>
            Buton Aktif/Pasif:
            <select
              value={butonAktif}
              onChange={(e) => {
                const isActive = e.target.value === 'true';
                setButonAktif(isActive);
                handleUpdate('anasayfaVideoButonAktif', isActive);
              }}
              className='mt-1 w-full rounded-lg border-gray-300 bg-yellow-100 p-2 outline-none'
            >
              <option value='true'>Aktif</option>
              <option value='false'>Pasif</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NasilKullanilir;
