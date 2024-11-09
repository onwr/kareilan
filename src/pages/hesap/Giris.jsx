import React, { useState } from 'react';
import logo from '@images/logo.png';
import emlak from '@images/emlak.jpg';
import logo2 from '@images/logo2.png';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';
import Loader from 'src/layout/Loader';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Giris = () => {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = collection(db, 'kullanicilar');
      const getQuery = query(docRef, where('email', '==', email), where('sifre', '==', sifre));
      const getSnap = await getDocs(getQuery);
      if (!getSnap.empty) {
        toast.success('Giriş başarılı.');
        Cookies.set('userToken', getSnap.docs[0].data().uid, { expires: 7 });
        setLoading(false);
        navigate('/hesap/panel');
      } else {
        toast.error('Girilen bilgiler geçersiz.');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Hata, 500');
      setLoading(false);
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='flex min-h-screen select-none'>
      <img
        src={emlak}
        className='absolute right-0 top-0 h-full w-full flex-none opacity-5'
        alt='Emlak Arka Planı'
      />
      <div className='flex w-full flex-col items-center justify-center gap-3 bg-black'>
        <img src={logo} alt='Logo' className='w-32' />
        <div className='flex w-full flex-col items-center gap-1 pb-20'>
          <p className='text-3xl font-semibold text-yellow-500'>Üyelik</p>
          <p className='text-md font-medium text-gray-400'>Giriş Yap</p>
          <form
            onSubmit={handleSubmit}
            className='z-50 mt-5 flex w-full flex-col items-center justify-center gap-1'
          >
            <input
              autoFocus
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-Posta'
              className='z-50 w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-yellow-400 outline-none ring-yellow-600 duration-300 focus:ring-2'
            />
            <input
              type='password'
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder='Şifre'
              className='mt-2 w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-yellow-400 outline-none ring-yellow-600 duration-300 focus:ring-2'
            />
            <button className='mt-4 w-80 rounded-xl bg-yellow-300 py-2 font-semibold text-black'>
              Giriş Yap
            </button>
            <p className='text-sm text-gray-400'>veya</p>
            <a href='/hesap/olustur' className='text-gray-300 hover:underline'>
              Üye Ol
            </a>
          </form>
          <img src={logo2} alt='Kürkaya Yazılım' className='absolute bottom-5 w-24' />
        </div>
      </div>
    </div>
  );
};

export default Giris;
