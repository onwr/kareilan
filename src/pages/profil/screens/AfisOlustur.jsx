import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { db } from 'src/db/Firebase';
import { CiCirclePlus } from 'react-icons/ci';
import OdemeModal from 'src/modals/odemeModal';
import { FaWhatsapp } from 'react-icons/fa6';
import NasilKullanilir from './modals/NasilKullanilir';
import './styles/ConfirmModal.css'

const AfisOlustur = ({ screen, token, demo }) => {
  const [afisData, setAfisData] = useState({ iletisimBilgi: {} });
  const [ilanSayisi, setIlanSayisi] = useState(0);
  const [kurumsalUye, setKurumsalUye] = useState(false);
  const [maxAfisLimit, setMaxAfisLimit] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [fiyatlar, setFiyatlar] = useState([]);
  const [howToUseModal, setHowToUseModal] = useState(false);
  const [ilanData, setIlanData] = useState([]);

  useEffect(() => {
    const kurumsalCheck = async () => {
      try {
        const docRef = doc(db, 'kullanicilar', token);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMaxAfisLimit(data.afisSinir);
          setAfisData((prevData) => ({
            ...prevData,
            musteri: data.ad,
            iletisimBilgi: { telefon: data.gsm, email: data.email },
          }));
          setKurumsalUye(docSnap.data().kurumsal);
        } else {
          toast.error('Kurumsal üye olmanız gerekmektedir.');
        }
      } catch (error) {
        console.error('Kurumsal bilgi çekme hatası:', error);
      }
    };

    kurumsalCheck();
  }, []);

  useEffect(() => {
    const fetchIlanSayisi = async () => {
      try {
        const ilanRef = collection(doc(db, 'kullanicilar', token), 'ilan');
        const snapshot = await getDocs(ilanRef);
        setIlanSayisi(snapshot.size);
        const snapData = snapshot.docs.map((doc) => doc.data());
        setIlanData(snapData);
      } catch (error) {
        toast.error('İlan sayısı alınamadı.');
      }
    };

    fetchIlanSayisi();
  }, [token]);

  useEffect(() => {
    const fetchFiyatlar = async () => {
      try {
        const fiyatRef = collection(db, 'fiyatlandirma');
        const snapshot = await getDocs(fiyatRef);
        const fiyatData = snapshot.docs.map((doc) => doc.data());
        fiyatData.sort((a, b) => parseInt(a.adet) - parseInt(b.adet));
        setFiyatlar(fiyatData);
      } catch (error) {
        toast.error('Fiyat bilgileri alınamadı.');
      }
    };

    fetchFiyatlar();
  }, []);

  const handleAfisOlustur = async (adet) => {
    if (demo) {
      toast.error('Demo modunda işlem yapılamaz.');
      return;
    }

    const kalanHak = maxAfisLimit - ilanSayisi;
    const olusturulacakAdet = adet > kalanHak ? kalanHak : adet;

    if (olusturulacakAdet <= 0) {
      toast.error('Maksimum afiş limitine ulaştınız.');
      return;
    }

    try {
      const ilanRef = collection(doc(db, 'kullanicilar', token), 'ilan');
      for (let i = 0; i < olusturulacakAdet; i++) {
        const yeniIlanId = String(ilanSayisi + i + 1).padStart(3, '0');

        const olusturmaTarih = Timestamp.now();

        const bitisTarih = Timestamp.fromMillis(
          olusturmaTarih.toMillis() + 7 * 24 * 60 * 60 * 1000
        );

        const ilanData = {
          ...afisData,
          olusturmaTarih,
          bitisTarih,
          links: {},
          docId: yeniIlanId,
        };

        setIlanData((prevData) => [...prevData, ilanData]);

        const docRef = doc(ilanRef, yeniIlanId);
        await setDoc(docRef, ilanData);
      }

      toast.success(`${olusturulacakAdet} adet afiş başarıyla oluşturuldu.`);
      setIlanSayisi((prevCount) => prevCount + olusturulacakAdet);
    } catch (error) {
      console.error('Afiş oluşturulurken hata oluştu:', error);
      toast.error('Lütfen daha sonra tekrar deneyiniz.');
    }
  };


  

  return (
    <div>
      <motion.div
        key='screen-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative mt-5'
      >
        
        <button
          onClick={() => setHowToUseModal(true)}
          className='absolute right-0 top-0 cursor-pointer rounded-lg bg-gradient-to-r from-red-400 to-red-600 p-2 text-xs text-white hover:to-red-200'
        >
          Nasıl Kullanılır
        </button>
        <h2 className='mb-2 text-xl font-semibold'>Afiş Oluştur</h2>
        <p className='mb-2 rounded-xl bg-yellow-500/20 p-2 text-center'>
          Kalan Afiş Hakkı <span className='font-bold'>{maxAfisLimit - ilanSayisi}</span>
        </p>

        <div className='mb-4'>
          <p className='rounded-t-lg bg-green-200 py-2 text-center font-semibold shadow-2xl'>
            Afişleriniz oluşturulduğu anda aktiftir ve kullanılabilir. Oluşturduğunuz afişlerin
            aktif kalabilmesi için 7 gün içerisinde ödeme yapmayı unutmayınız.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className='w-full rounded-b-lg border-b bg-yellow-100 py-2 font-bold shadow-inner duration-300 hover:bg-yellow-300'
          >
            Ödeme Yap
          </button>
        </div>

        <div className='mb-4 w-full rounded-lg border bg-yellow-100 p-2'>
          <p className='text-center text-lg font-semibold'>Aktif Afişleriniz</p>
          <div className='mt-3 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6'>
            {ilanData.map((ilan, index) => (
              <div
                key={index}
                className='flex items-center justify-center rounded-lg border bg-white p-2 text-center text-xs shadow-inner'
              >
                <p className='text-center font-bold'>{ilan.docId}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <p className='text-xl font-bold underline'>Fiyatlandırma</p>
          <table className='min-w-full table-auto'>
            <thead>
              <tr className='border-b'>
                <th className='px-4 py-2 text-left'>İlan Adeti</th>
                <th className='px-4 py-2 text-left'>Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {fiyatlar.map((fiyat) => (
                <tr key={fiyat.adet} className='border-b'>
                  <td className='px-4 py-2'>{fiyat.adet} Adet İlan</td>
                  <td className='px-4 py-2'>{fiyat.fiyat} ₺ /Yıl</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-5 text-xl font-bold underline'>Bireysel Üyelik</p>
        <div className='mt-2 flex flex-col items-center gap-2 md:flex-row'>
          <div
            className='group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-gradient-to-b from-amber-200 to-slate-50 p-12 ring-yellow-600 duration-300 hover:ring-1 md:w-auto'
            onClick={() => handleAfisOlustur(5)}
          >
            <CiCirclePlus className='size-20 rounded-full duration-300 group-hover:bg-white/50' />
            <p className='text-xl font-semibold'>5 Adet Afiş Oluştur</p>
          </div>
          <div
            className='group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-gradient-to-b from-amber-200 to-slate-50 p-12 ring-yellow-600 duration-300 hover:ring-1 md:w-auto'
            onClick={() => handleAfisOlustur(10)}
          >
            <CiCirclePlus className='size-20 rounded-full duration-300 group-hover:bg-white/50' />
            <p className='text-xl font-semibold'>10 Adet Afiş Oluştur</p>
          </div>
        </div>

        <p className='mt-5 text-xl font-bold underline'>Kurumsal Üyelik</p>
        <div className='mt-2 flex flex-col items-center gap-2 md:flex-row'>
          <div
            className='group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-gradient-to-b from-amber-200 to-slate-50 p-12 ring-yellow-600 duration-300 hover:ring-1 md:w-auto'
            onClick={() => handleAfisOlustur(20)}
          >
            <CiCirclePlus className='size-20 rounded-full duration-300 group-hover:bg-white/50' />
            <p className='text-xl font-semibold'>20 Adet Afiş Oluştur</p>
          </div>
          <a
            className='group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-gradient-to-b from-green-200 to-slate-50 p-12 ring-green-600 duration-300 hover:ring-1 md:w-auto'
            href='https://wa.me/905345848039'
          >
            <FaWhatsapp className='size-20 duration-300' />
            <p className='text-center text-sm font-semibold md:text-lg'>
              Daha fazla afiş ihtiyacınız varsa bizimle iletişime geçin
            </p>
          </a>
        </div>

        <NasilKullanilir
          show={howToUseModal}
          onClose={() => setHowToUseModal(false)}
          sayfa='afisolustur'
        />

        <button
          onClick={() => screen(0)}
          className='mt-5 w-full rounded-xl bg-black/50 py-2 font-semibold text-white'
        >
          Geri Dön
        </button>
      </motion.div>

      <OdemeModal isOpen={showModal} onClose={setShowModal} />
    </div>
  );
};

export default AfisOlustur;
