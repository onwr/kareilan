import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '@images/logo.png';
import emlakBG from '@images/emlak.jpg';
import { db } from 'src/db/Firebase';
import { collection, getDoc, getDocs, query, where, doc } from 'firebase/firestore';
import telefon from '@images/icons/telefon.webp';
import whatsapp from '@images/icons/wp.webp';
import mail from '@images/icons/mail.webp';
import Loader from 'src/layout/Loader'; // Assuming this is your custom loader
import { motion } from 'framer-motion';

const IlanDetay = () => {
  const { firma, id } = useParams();
  const [emlakData, setEmlakData] = useState({});
  const [firmaAd, setFirmaAd] = useState('');
  const [loading, setLoading] = useState(true); // Set loading state to true initially

  useEffect(() => {
    const ilanGetir = async () => {
      try {
        const kullaniciQuery = query(collection(db, 'kullanicilar'), where('slug', '==', firma));
        const kullaniciSnapshot = await getDocs(kullaniciQuery);

        if (!kullaniciSnapshot.empty) {
          const kullaniciDoc = kullaniciSnapshot.docs[0];
          setFirmaAd(kullaniciDoc.data().firma);
          const ilanRef = doc(db, `kullanicilar/${kullaniciDoc.id}/ilan`, id);
          const ilanSnapshot = await getDoc(ilanRef);

          if (ilanSnapshot.exists()) {
            setEmlakData(ilanSnapshot.data());
          } else {
            console.error('İlan bulunamadı');
          }
        } else {
          console.error('Firma bulunamadı');
        }
      } catch (error) {
        console.error('Hata oluştu:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    ilanGetir();
  }, [firma, id]);

  // If data is loading, show the Loader component
  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className='relative min-h-screen'
      style={{
        backgroundImage: `url(${emlakBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className='relative z-10 flex min-h-screen flex-col items-center bg-black bg-opacity-95 py-5 md:justify-center'>
        <motion.img
          src={logo}
          alt='Kareilan'
          className='w-20 md:w-40'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <p className='text-2xl text-primary'>kareilan.com</p>
        <div className='px-5'>
          <motion.div
            className='container mt-5 max-w-screen-xl rounded-xl bg-white/5 p-5 text-primary ring-4 ring-yellow-200 md:p-4'
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className='text-center text-2xl text-white'>{firmaAd || 'Bulunamadı'}</h1>

            <motion.div
              className='mb-2 mt-2 text-center text-sm font-medium text-white md:text-justify'
              style={{ whiteSpace: 'pre-wrap' }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {emlakData.aciklama}
            </motion.div>

            <div className='mx-auto w-full rounded-xl border px-5 py-2 md:mt-5'>
              <h1 className='text-center text-base font-medium text-primary md:text-lg lg:text-xl'>
                İlan detayını görüntülemek istediğiniz siteyi seçiniz
              </h1>
              <div className='mt-3 grid grid-cols-3 justify-center gap-5 md:flex md:items-center md:justify-around'>
                {emlakData.links &&
                  Object.keys(emlakData.links).map((platformKey, index) => {
                    const platform = emlakData.links[platformKey];

                    return (
                      <motion.a
                        key={index}
                        href={platform.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, delay: index * 0.3 }}
                      >
                        <img src={platform.imageUrl} className='w-32 rounded-lg' />
                      </motion.a>
                    );
                  })}
              </div>
            </div>

            <div className='mx-auto mt-5 w-full rounded-xl border px-5 py-2'>
              <h1 className='text-md text-center font-medium text-primary md:text-xl lg:text-3xl'>
                İletişim
              </h1>
              <div className='flex items-center justify-around gap-2'>
                {emlakData.iletisimBilgi?.telefon && (
                  <a
                    href={`tel:${emlakData.iletisimBilgi.telefon}`}
                    className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'
                  >
                    <img src={telefon} className='w-32' alt='Telefon' />
                  </a>
                )}
                {emlakData.iletisimBilgi?.email && (
                  <a
                    href={`mailto:${emlakData.iletisimBilgi.email}`}
                    className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'
                  >
                    <img src={mail} className='w-32' alt='Email' />
                  </a>
                )}
                {emlakData.iletisimBilgi?.telefon && (
                  <a
                    href={`https://wa.me/${emlakData.iletisimBilgi.telefon}`}
                    className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'
                  >
                    <img src={whatsapp} className='w-32' alt='WhatsApp' />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default IlanDetay;
