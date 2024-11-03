import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SiCanva } from 'react-icons/si';
import { db } from 'src/db/Firebase';
import IletisimBilgi from './modals/IletisimBilgi';

const AfisOlustur = ({ loading, screen, token }) => {
  const [afisData, setAfisData] = useState({
    baslik: '',
    sahibinden: '',
    hepsiemlak: '',
    zingat: '',
    emlakjet: '',
    kurumsal: '',
    firmaLink: '',
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAfisData({ ...afisData, [name]: value });
  };

  const validateUrl = (url, platform) => {
    const platformPatterns = {
      sahibinden: /^https:\/\/(www\.)?(sahibinden\.com|shbd\.io)\/.+$/,
      hepsiemlak: /^https:\/\/(www\.)?hepsiemlak\.com\/.+$/,
      zingat: /^https:\/\/(www\.)?zingat\.com\/.+$/,
      emlakjet: /^https:\/\/(www\.)?emlakjet\.com\/.+$/,
      turyap: /^https:\/\/(www\.)?turyap\.com\.tr\/Portfoy_Bilgileri\.aspx\?ProductID=\d+$/,
      remax: /^https:\/\/(www\.)?remax\.com\.tr\/portfoy\/P\d+$/,
      century21: /^https:\/\/(www\.)?century21\.com\.tr\/tr-TR\/Stocks\/Detail\/.+$/,
      kw: /^https:\/\/(www\.)?kw\.com\/tr\/property\/.+$/,
      coldwellBanker: /^https:\/\/(www\.)?cb\.com\.tr\/tr-tr\/Stocks\/Detail\/.+$/,
      premar: /^https:\/\/(www\.)?premar\.com\.tr\/ilan\/.+$/,
      firmaLink:
        /^https:\/\/(www\.)?(premar\.com\.tr|cb\.com\.tr|kw\.com|century21\.com\.tr|remax\.com\.tr|turyap\.com\.tr)\/.+$/,
    };
    return platformPatterns[platform]?.test(url);
  };

  const handleAfisOlustur = () => {
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
    if (!validateUrl(afisData.turyap, 'turyap')) {
      setError('Geçersiz Turyap URLsi.');
      return;
    }
    if (!validateUrl(afisData.remax, 'remax')) {
      setError('Geçersiz Remax URLsi.');
      return;
    }
    if (!validateUrl(afisData.century21, 'century21')) {
      setError('Geçersiz Century21 URLsi.');
      return;
    }
    if (!validateUrl(afisData.kw, 'kw')) {
      setError('Geçersiz Keller Williams URLsi.');
      return;
    }
    if (!validateUrl(afisData.coldwellBanker, 'coldwellBanker')) {
      setError('Geçersiz Coldwell Banker URLsi.');
      return;
    }
    if (!validateUrl(afisData.premar, 'premar')) {
      setError('Geçersiz Premar URLsi.');
      return;
    }
    if (!validateUrl(afisData.firmaLink, 'firmaLink')) {
      setError(
        'Geçersiz Firma Web Sayfası Linki. Yalnızca belirli kurumsal sitelere izin veriliyor.'
      );
      return;
    }
    setError('');
    console.log('Afiş oluşturuluyor...', afisData);
  };

  const mevcutBilgileriCek = async () => {
    try {
      const docRef = doc(db, 'kullanicilar', token);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().mevcutBilgi) {
        console.log('Mevcut bilgi bulundu:', docSnap.data().mevcutBilgi);
      } else {
        toast.error('Bilgiler bulunamadı.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Bilgi çekme hatası:', error);
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
        <form className='grid grid-cols-2 gap-4'>
          <textarea
            name='baslik'
            placeholder='İlan Başlığı'
            className='col-span-2 rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.baslik}
            onChange={handleChange}
          />
          <div className='col-span-2 grid grid-cols-2 gap-2'>
            <input
              type='text'
              name='sahibinden'
              placeholder='Sahibinden Linki'
              className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
              value={afisData.sahibinden}
              onChange={handleChange}
            />
            <input
              type='text'
              name='hepsiemlak'
              placeholder='Hepsiemlak Linki'
              className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
              value={afisData.hepsiemlak}
              onChange={handleChange}
            />
            <input
              type='text'
              name='emlakjet'
              placeholder='Emlakjet Linki'
              className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
              value={afisData.emlakjet}
              onChange={handleChange}
            />
            <input
              type='text'
              name='zingat'
              placeholder='Zingat Linki'
              className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
              value={afisData.zingat}
              onChange={handleChange}
            />
            {error && <p className='text-red-500'>{error}</p>}
          </div>
          <input
            type='text'
            name='kurumsal'
            placeholder='Kurumsal Web Sayfası Linki'
            className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.kurumsal}
            onChange={handleChange}
          />
          <input
            type='text'
            name='firmaLink'
            placeholder='Firma Web Sayfası Linki'
            className='rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
            value={afisData.firmaLink}
            onChange={handleChange}
          />
          <div className='col-span-2'>
            <p className='my-1 text-center text-xl font-semibold'>İletişim Bilgileri</p>
            <div className='mt-2 grid grid-cols-3 items-center justify-center gap-5 lg:flex'>
              <button
                type='button'
                onClick={mevcutBilgileriCek}
                className='rounded-full border-2 border-yellow-400 bg-white p-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'
              >
                Mevcudu Kullan
              </button>
              <button className='rounded-full border-2 border-yellow-400 bg-white p-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'>
                Bu İlan İçin Yeni Bilgi Gir
              </button>
              <button className='rounded-full border-2 border-yellow-400 bg-yellow-200 p-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'>
                Karekodu Yazdır
              </button>
              <button className='rounded-full border-2 border-yellow-400 bg-yellow-200 p-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'>
                Karekodu Kopyala
              </button>
              <button className='col-span-2 flex items-center justify-center gap-2 rounded-full border-2 border-yellow-400 bg-yellow-200 p-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'>
                Şablonlara Git <SiCanva size='32' />
              </button>
            </div>
          </div>
          <button
            type='button'
            onClick={handleAfisOlustur}
            className='rounded bg-yellow-400 p-3 font-semibold text-black duration-300 hover:bg-yellow-500'
          >
            Afişi Oluştur
          </button>
          <button
            type='button'
            onClick={() => screen(0)}
            className='rounded bg-black/50 p-3 font-semibold text-white duration-300 hover:bg-black/60'
          >
            Geri Dön
          </button>
        </form>
      </motion.div>
      <IletisimBilgi token={token} />
    </div>
  );
};

export default AfisOlustur;
