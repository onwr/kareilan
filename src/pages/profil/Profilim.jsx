import React, { useEffect, useState } from 'react';
import logo from '@images/logo.png';
import emlakBG from '@images/emlakbg.avif';
import Loader from 'src/layout/Loader';
import { AiOutlineLogout } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import { MdNumbers } from 'react-icons/md';
import toast from 'react-hot-toast';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { SiCanva } from 'react-icons/si';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AfisOlustur from './screens/AfisOlustur';

const Profilim = () => {
  const [loading, setLoading] = useState(false);
  const [emlak, setEmlak] = useState({});
  const [formData, setFormData] = useState({});
  const userToken = Cookies.get('userToken');
  const navigate = useNavigate();
  const [selectScreen, setSelectScreen] = useState(0);

  useEffect(() => {
    setLoading(true);
    const veriCek = async () => {
      try {
        const docRef = doc(db, 'kullanicilar', userToken);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmlak(docSnap.data());
          setFormData(docSnap.data());
          setLoading(false);
        } else {
          toast.error('Lütfen tekrar giriş yapınız.');
          Cookies.remove('userToken');
          setLoading(false);
          navigate('/hesap/giris');
        }
      } catch (error) {
        toast.error('Lütfen tekrar giriş yapınız.');
        Cookies.remove('userToken');
        console.log(error);
        setLoading(false);
        navigate('/hesap/giris');
      }
    };

    veriCek();
  }, []);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'kullanicilar', userToken);
      await updateDoc(docRef, formData);
      toast.success('Profil güncellendi');
      setEmlak(formData);
      setSelectScreen(0);
    } catch (error) {
      toast.error('Güncelleme sırasında bir hata oluştu.');
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='flex min-h-screen items-center justify-center bg-neutral-200 px-1'>
      <img
        src={emlakBG}
        className='absolute right-0 top-0 z-0 h-full w-full bg-cover opacity-15'
        alt='background'
      />
      <div className='container z-10 mx-auto max-w-screen-xl rounded-xl border border-neutral-300 bg-zinc-50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center rounded-full border bg-yellow-200 p-2'>
            <MdNumbers />
            <p className='font-semibold'>{emlak.fKod}</p>
          </div>
          <div className='flex flex-col items-center gap-0.5'>
            <p className='text-xl font-semibold'>{emlak.firma}</p>
            <p className='text-sm font-medium'>{emlak.ad}</p>
          </div>
          <AiOutlineLogout
            className='cursor-pointer rounded-full border bg-yellow-200 p-2 text-black duration-300 hover:bg-black hover:text-white'
            size='40'
            onClick={() => {
              Cookies.remove('userToken');
              navigate('/hesap/giris');
            }}
          />
        </div>

        {selectScreen === 0 ? (
          <motion.div
            key='screen-0'
            className='mt-5 grid grid-cols-2 gap-5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              onClick={() => setSelectScreen(1)}
              className='group flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-yellow-200 p-5 ring-2 ring-yellow-400 ring-offset-2 duration-300 hover:ring-4 hover:ring-black/20'
            >
              <FaUser className='size-20 rounded-full duration-300 group-hover:text-black/50 md:size-32' />
              <p className='mt-2 text-center text-xl font-semibold'>Profil</p>
            </div>
            <div className='group flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-yellow-200 p-5 ring-2 ring-yellow-400 ring-offset-2 duration-300 hover:ring-4 hover:ring-black/20'>
              <MdModeEdit className='size-20 rounded-full duration-300 group-hover:text-black/50' />
              <p className='mt-2 text-center text-xl font-semibold'>Afiş Düzenle</p>
            </div>
            <div
              onClick={() => setSelectScreen(2)}
              className='group flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-yellow-200 p-5 ring-2 ring-yellow-400 ring-offset-2 duration-300 hover:ring-4 hover:ring-black/20'
            >
              <IoAddCircleOutline className='size-20 rounded-full duration-300 group-hover:text-black/50 md:size-32' />
              <p className='mt-2 text-center text-xl font-semibold'>Afiş Oluştur</p>
            </div>
            <div className='group flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-yellow-200 p-5 ring-2 ring-yellow-400 ring-offset-2 duration-300 hover:ring-4 hover:ring-black/20'>
              <SiCanva className='size-20 rounded-full duration-300 group-hover:text-black/50 md:size-32' />
              <p className='mt-2 text-center text-xl font-semibold'>Şablonlara Git</p>
            </div>
          </motion.div>
        ) : selectScreen === 1 ? (
          <motion.div
            key='screen-1'
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='mt-5'
          >
            <h2 className='mb-4 text-xl font-semibold'>Profil Bilgilerini Güncelle</h2>
            <form className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                name='firma'
                value={formData.firma || ''}
                onChange={handleInputChange}
                placeholder='Firma Adı'
                className='rounded border p-2'
              />
              <input
                type='text'
                name='ad'
                value={formData.ad || ''}
                onChange={handleInputChange}
                placeholder='Ad'
                className='rounded border p-2'
              />
              <input
                type='email'
                name='email'
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder='Email'
                className='rounded border p-2'
              />
              <input
                type='text'
                name='gsm'
                value={formData.gsm || ''}
                onChange={handleInputChange}
                placeholder='Telefon Numarası'
                className='rounded border p-2'
              />
              <input
                type='password'
                name='sifre'
                value={formData.sifre || ''}
                onChange={handleInputChange}
                placeholder='Şifre'
                className='rounded border p-2'
              />
              <button
                type='button'
                onClick={handleUpdate}
                className='rounded bg-yellow-400 p-3 font-semibold text-black duration-300 hover:bg-yellow-500'
              >
                Güncelle
              </button>
              <button
                type='button'
                onClick={() => setSelectScreen(0)}
                className='rounded bg-black/50 p-3 font-semibold text-white duration-300 hover:bg-black/60'
              >
                Geri Dön
              </button>
            </form>
          </motion.div>
        ) : selectScreen === 2 ? (
          <AfisOlustur loading={setLoading} screen={setSelectScreen} token={userToken} />
        ) : null}
      </div>
    </div>
  );
};

export default Profilim;
