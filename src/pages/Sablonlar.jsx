import React, { useEffect, useState } from 'react';
import sablonlar from '../video/sablonlar.mp4';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NasilKullanilir from './profil/screens/modals/NasilKullanilir';

const Sablonlar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [yataySablon, setYataySablon] = useState([]);
  const [dikeySablon, setDikeySablon] = useState([]);
  const [kareSablon, setKareSablon] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFirma, setSelectedFirma] = useState('');
  const [kategoriList, setKategoriList] = useState([]);
  const [howToUseModal, setHowToUseModal] = useState(false);
  const navigate = useNavigate();

  const sablonCek = async () => {
    try {
      const sablonRef = collection(db, 'sablonlar');
      const sablonSnap = await getDocs(sablonRef);

      if (!sablonSnap.empty) {
        const dikeyList = [];
        const yatayList = [];
        const kareList = [];

        sablonSnap.forEach((sablon) => {
          const data = sablon.data();

          if (data.type === 'Dikey') {
            dikeyList.push(data);
          } else if (data.type === 'Yatay') {
            yatayList.push(data);
          } else if (data.type === 'Kare') {
            kareList.push(data);
          }
        });

        setDikeySablon(dikeyList);
        setYataySablon(yatayList);
        setKareSablon(kareList);
      }
    } catch (error) {
      toast.error('Şablonlar çekilirken hata oluştu');
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const docRef = doc(db, 'sablonKategori', 'kategoriler');
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
    sablonCek();
    fetchCategories();
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const filterTemplates = (templates) => {
    return templates.filter((item) => {
      return (
        (!selectedCategory || item.type === selectedCategory) &&
        (!selectedFirma || item.firma === selectedFirma)
      );
    });
  };

  const pageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center'
    >
      <div className='container mx-auto max-w-screen-2xl px-2'>
        <motion.video
          src={sablonlar}
          muted
          width={'100%'}
          height={'auto'}
          autoPlay={true}
          className='rounded-b-xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.video>

        <motion.button
          onClick={() => navigate('/hesap/panel')}
          className='mt-2 w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700'
          whileHover={{ scale: 1.05 }}
        >
          Geri Dön
        </motion.button>
        <motion.button
          onClick={() => setHowToUseModal(true)}
          className='mt-2 w-full rounded bg-gradient-to-r from-red-400 to-red-600 p-2 font-semibold text-white hover:to-red-200'
          whileHover={{ scale: 1.05 }}
        >
          Nasıl Kullanılır
        </motion.button>
        <motion.button
          onClick={togglePopup}
          className='mt-2 w-full rounded bg-yellow-500 py-2 font-semibold text-white hover:bg-yellow-700'
          whileHover={{ scale: 1.05 }}
        >
          Şablonlar Hakkında Bilgi
        </motion.button>

        <AnimatePresence>
          {showPopup && (
            <motion.div
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={popupVariants}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className='relative w-11/12 max-w-lg rounded-lg bg-white p-6 shadow-lg'
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <button
                  onClick={togglePopup}
                  className='absolute right-2 top-6 rounded-full bg-red-500 p-1 px-3 text-white hover:bg-red-700'
                >
                  X
                </button>
                <h2 className='mb-4 text-center text-2xl font-bold'>Şablonlar Hakkında Bilgi</h2>
                <p className='text-lg'>
                  Canva, 2012 yılından beri kullanıcıların sosyal medya grafikleri, sunumları,
                  posterleri ve diğer görsel içerikleri oluşturmasına olanak tanıyan bir grafik
                  tasarım platformudur. Web'de ve mobilde kullanılabilir ve milyonlarca resim, yazı
                  tipi, şablon ve illüstrasyonu entegre eder. Kullanıcılar, birçok profesyonel
                  tasarlanmış şablon arasından seçim yapabilir, tasarımları düzenleyebilir ve
                  sürükle ve bırak arayüzü ile kendi fotoğraflarını yükleyebilir.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='mx-auto mt-4 flex flex-col gap-4 md:flex-row'>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='w-full max-w-80 rounded-md border p-2'
        >
          <option value=''>Tüm Kategoriler</option>
          <option value='Yatay'>Yatay</option>
          <option value='Dikey'>Dikey</option>
          <option value='Kare'>Kare</option>
        </select>

        <select
          value={selectedFirma}
          onChange={(e) => setSelectedFirma(e.target.value)}
          className='w-full max-w-80 rounded-md border p-2'
        >
          <option value=''>Firma Şablonu Seç</option>
          {kategoriList.map((kategori, index) => (
            <option key={index} value={kategori.ad}>
              {kategori.ad}
            </option>
          ))}
        </select>
      </div>

      <motion.p
        className='mt-5 text-3xl font-bold'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        YATAY AFİŞLER
      </motion.p>
      <div className='container px-2 md:px-0 mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3'>
        {filterTemplates(yataySablon).map((item, index) => (
          <motion.div
            key={index}
            className='flex flex-col rounded-md border h-fit items-center gap-3 bg-neutral-100 p-4'
            whileHover={{ scale: 1.05 }}
          >
            <img src={item.link} className='w-40' alt={`Yatay Afiş ${index + 1}`} />
            <p className='font-semibold'>{item.baslik}</p>
            <p>{item.aciklama}</p>
            <a
              className='w-full rounded-xl bg-yellow-300 py-2 text-center duration-300 hover:bg-yellow-400'
              href={item.adres}
            >
              Şablona Git
            </a>
          </motion.div>
        ))}
      </div>

      <motion.p
        className='mt-5 text-3xl font-bold'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        DİKEY AFİŞLER
      </motion.p>
      <div className='container px-2 md:px-0 mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3'>
        {filterTemplates(dikeySablon).map((item, index) => (
          <motion.div
            key={index}
            className='flex flex-col h-fit rounded-md border items-center gap-3 bg-neutral-100 p-4'
            whileHover={{ scale: 1.05 }}
          >
            <img src={item.link} className='w-40' alt={`Dikey Afiş ${index + 1}`} />
            <p className='font-semibold'>{item.baslik}</p>
            <p>{item.aciklama}</p>
            <a
              className='w-full rounded-xl bg-yellow-300 py-2 text-center duration-300 hover:bg-yellow-400'
              href={item.adres}
            >
              Şablona Git
            </a>
          </motion.div>
        ))}
      </div>

      <motion.p
        className='mt-5 text-3xl font-bold'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        KARE AFİŞLER
      </motion.p>
      <div className='container mt-3 grid grid-cols-2 gap-5 lg:grid-cols-3'>
        {filterTemplates(kareSablon).map((item, index) => (
          <motion.div
            key={index}
            className='flex flex-col items-center gap-3 bg-neutral-100 p-4'
            whileHover={{ scale: 1.05 }}
          >
            <img src={item.link} className='w-40' alt={`Kare Afiş ${index + 1}`} />
            <p className='font-semibold'>{item.baslik}</p>
            <p>{item.aciklama}</p>
            <a
              className='w-full rounded-xl bg-yellow-300 py-2 text-center duration-300 hover:bg-yellow-400'
              href={item.adres}
            >
              Şablona Git
            </a>
          </motion.div>
        ))}
      </div>

      <NasilKullanilir
        show={howToUseModal}
        onClose={() => setHowToUseModal(false)}
        sayfa='sablonlar'
      />
    </motion.div>
  );
};

export default Sablonlar;
