import { addDoc, collection, doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SiCanva } from 'react-icons/si';
import { db } from 'src/db/Firebase';
import IletisimBilgi from './modals/IletisimBilgi';
import YeniIletisimModal from './modals/YeniIletisim';
import AfisIndir from './modals/AfisIndir';

const AfisOlustur = ({ screen, token }) => {
  const [afisData, setAfisData] = useState({
    baslik: '',
    aciklama: '',
    sahibinden: '',
    hepsiemlak: '',
    zingat: '',
    emlakjet: '',
    kurumsal: '',
    firmaLink: '',
    iletisimBilgi: {},
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalYeniIletisim, setShowModalYeniIletisim] = useState(false);
  const [afisOlusturModal, setAfisOlusturModal] = useState(false);
  const [ilanSayisi, setIlanSayisi] = useState('');

  useEffect(() => {
    const fetchIlanSayisi = async () => {
      try {
        const ilanRef = collection(doc(db, 'kullanicilar', token), 'ilan');
        const snapshot = await getDocs(ilanRef);

        const ilanSayisi = snapshot.size;
        setIlanSayisi('00' + (ilanSayisi + 1));
      } catch (error) {
        toast.error('İlan sayısı alınamadı.');
      }
    };

    fetchIlanSayisi();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAfisData({ ...afisData, [name]: value });
  };

  const handleYeniIletisimEkle = (contanctInfo) => {
    setAfisData((prevData) => ({ ...prevData, iletisimBilgi: contanctInfo }));
    toast.success('Yeni iletişim bilgileri eklendi.');
    setShowModalYeniIletisim(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setShowModalYeniIletisim(false);
    setAfisOlusturModal(false);
  };

  const validateUrl = (url, platform) => {
    const platformPatterns = {
      sahibinden: /^https:\/\/(www\.)?(sahibinden\.com|shbd\.io)\/.+$/,
      hepsiemlak: /^https:\/\/(www\.)?hepsiemlak\.com\/.+$/,
      zingat: /^https:\/\/(www\.)?zingat\.com\/.+$/,
      emlakjet: /^https:\/\/(www\.)?emlakjet\.com\/.+$/,
    };
    return platformPatterns[platform]?.test(url);
  };

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      if (screen !== 0) {
        screen(0);
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [screen]);

  const handleAfisOlustur = async (e) => {
    e.preventDefault();

    try {
      if (!validateUrl(afisData.sahibinden, 'sahibinden')) {
        setError('Geçersiz Sahibinden URLsi.');
        return;
      }
      if (!validateUrl(afisData.hepsiemlak, 'hepsiemlak')) {
        setError('Geçersiz Hepsiemlak URLsi.');
        return;
      }
      if (!validateUrl(afisData.zingat, 'zingat')) {
        setError('Geçersiz Zingat URLsi.');
        return;
      }
      if (!validateUrl(afisData.emlakjet, 'emlakjet')) {
        setError('Geçersiz Emlakjet URLsi.');
        return;
      }
      setError('');

      const ilanRef = collection(doc(db, 'kullanicilar', token), 'ilan');

      const yeniIlanId = ilanSayisi.toString().padStart(3, '0');

      const ilanData = {
        ...afisData,
        olusturmaTarih: Timestamp.now(),
        docId: yeniIlanId,
      };

      const docRef = doc(ilanRef, yeniIlanId);
      await setDoc(docRef, ilanData);

      toast.success('Afiş oluşturuldu.');
    } catch (error) {
      console.error('Afiş oluşturulurken hata oluştu:', error);
      toast.error('Lütfen daha sonra tekrar deneyiniz.');
    }
  };

  const mevcutBilgileriCek = async () => {
    try {
      const docRef = doc(db, 'kullanicilar', token);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().mevcutBilgi) {
        const mevcutBilgi = docSnap.data().mevcutBilgi;
        setAfisData((prevData) => ({ ...prevData, iletisimBilgi: mevcutBilgi }));
        toast.success('Mevcut iletişim bilgileri eklendi.');
        console.log('Mevcut bilgi bulundu:', mevcutBilgi);
      } else {
        toast.error('Bilgiler bulunamadı.');
      }
    } catch (error) {
      console.error('Bilgi çekme hatası:', error);
    }
  };

  const kurumsalCheck = async () => {
    try {
      const docRef = doc(db, 'kullanicilar', token);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const kurumsal = docSnap.data().kurumsal;
        if (kurumsal) {
          setShowModalYeniIletisim(true);
        } else {
          toast.error(
            'Sadece kurumsal kullanıcılar afişe özel bilgi girebilir. Afişlerinizdeki bilgileri profil kısmından yönetebilirsiniz'
          );
        }
      } else {
        toast.error('Kurumsal üye olmanız gerekmektedir.');
      }
    } catch (error) {
      console.error('Kurumsal bilgi çekme hatası:', error);
    }
  };

  return (
    <div>
      <motion.div
        key='screen-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='mt-5'
      >
        <h2 className='mb-4 text-xl font-semibold'>Afiş Oluştur</h2>
        <form className='flex flex-col items-center gap-2'>
          <input
            name='baslik'
            placeholder='İlan Başlığı'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.baslik}
            onChange={handleChange}
          />
          <textarea
            name='aciklama'
            placeholder='İlan Açıklaması'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.aciklama}
            onChange={handleChange}
          />
          <input
            type='text'
            name='sahibinden'
            placeholder='Sahibinden Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.sahibinden}
            onChange={handleChange}
          />
          <input
            type='text'
            name='hepsiemlak'
            placeholder='Hepsiemlak Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.hepsiemlak}
            onChange={handleChange}
          />
          <input
            type='text'
            name='emlakjet'
            placeholder='Emlakjet Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.emlakjet}
            onChange={handleChange}
          />
          <input
            type='text'
            name='zingat'
            placeholder='Zingat Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.zingat}
            onChange={handleChange}
          />
          {error && <p className='text-red-500'>{error}</p>}
          <input
            type='text'
            name='kurumsal'
            placeholder='Kurumsal Web Sayfası Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.kurumsal}
            onChange={handleChange}
          />
          <input
            type='text'
            name='firmaLink'
            placeholder='Firma Web Sayfası Linki'
            className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.firmaLink}
            onChange={handleChange}
          />
          <div className='w-full'>
            <p className='my-1 text-center text-xl font-semibold'>İletişim Bilgileri</p>
            <div className='mt-2 grid grid-cols-3 items-center justify-center gap-2 lg:flex'>
              <button
                type='button'
                onClick={mevcutBilgileriCek}
                className='col-span-2 rounded-lg border-2 border-yellow-400 px-2 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:px-5 md:text-base'
              >
                Mevcudu Kullan
              </button>
              <button
                type='button'
                onClick={() => kurumsalCheck()}
                className='col-span-1 rounded-lg border-2 border-yellow-400 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:px-5 md:text-base'
              >
                Yeni Bilgi Gir
              </button>
              <button
                type='button'
                onClick={() => setAfisOlusturModal(true)}
                className='col-span-3 rounded-lg border-2 border-yellow-400 px-2 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:px-5 md:text-base'
              >
                Afişi İndir
              </button>
              <button
                type='button'
                className='col-span-3 flex items-center justify-center gap-2 rounded-lg border-2 border-yellow-400 px-5 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'
              >
                Şablonlara Git <SiCanva size='24' />
              </button>
            </div>
          </div>
          <button
            type='submit'
            onClick={handleAfisOlustur}
            className='w-full rounded bg-yellow-400 p-3 font-semibold text-black duration-300 hover:bg-yellow-500'
          >
            Afişi Oluştur
          </button>
          <button
            type='button'
            onClick={() => screen(0)}
            className='w-full rounded bg-black/50 p-3 font-semibold text-white duration-300 hover:bg-black/60'
          >
            Geri Dön
          </button>
        </form>
      </motion.div>
      {showModal && <IletisimBilgi token={token} onClose={onCloseModal} />}
      {showModalYeniIletisim && (
        <YeniIletisimModal onClose={onCloseModal} onSave={handleYeniIletisimEkle} />
      )}
      {afisOlusturModal && <AfisIndir onClose={onCloseModal} />}
    </div>
  );
};

export default AfisOlustur;
