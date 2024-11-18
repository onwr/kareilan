import React, { useEffect, useState } from 'react';
import logo from '@images/logo.png';
import emlak from '@images/emlak.jpg';
import { auth, db } from '../../db/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/layout/Loader';
import Cookies from 'js-cookie';

const ProfilOlustur = () => {
  const [formData, setFormData] = useState({
    ad: '',
    firma: '',
    gsm: '',
    email: '',
    sifre: '',
    slug: '',
    kurumsal: false,
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [metin, setMetin] = useState('');

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = doc(db, 'sozlesme', 'kullanici');
        const getData = await getDoc(docRef);

        if (getData.exists()) {
          setMetin(getData.data());
        } else {
          toast.error('Bulunamadı');
        }
      } catch (error) {
        toast.error('Kullanıcı sözleşmesi metni bulunamadı.');
        console.log(error);
      }
    };

    veriCek();
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'gsm') {
      const cleanedValue = value.replace(/\D/g, '');
      if (!/^5\d{0,9}$/.test(cleanedValue)) return;

      const formattedValue = cleanedValue
        .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2 $3 $4')
        .trim();
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, ad, firma, gsm, sifre, slug, kurumsal } = formData;

    if (!termsAccepted) {
      toast.error('Kullanıcı sözleşmesini kabul etmelisiniz');
      setLoading(false);
      return;
    }

    if (!gsm || !/^\(5\d{2}\) \d{3} \d{2} \d{2}$/.test(gsm)) {
      toast.error('Lütfen geçerli bir GSM numarası giriniz (örneğin: (5xx) xxx xx xx)');
      setLoading(false);
      return;
    }

    if (sifre.length < 6) {
      toast.error('Şifreniz en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    if (!email || !ad || !firma || !gsm || !sifre || !slug) {
      toast.error('Lütfen tüm alanları doldurunuz');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Geçersiz e-posta adresi');
      setLoading(false);
      return;
    }

    try {
      const gsmQuery = query(collection(db, 'kullanicilar'), where('gsm', '==', gsm));
      const gsmSnapshot = await getDocs(gsmQuery);

      if (!gsmSnapshot.empty) {
        toast.error('Bu telefon numarası zaten kayıtlı.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
      const userId = userCredential.user.uid;
      const randomKod = Math.floor(10000 + Math.random() * 90000);

      await setDoc(doc(db, 'kullanicilar', userId), {
        ad,
        firma,
        gsm,
        email,
        sifre,
        uid: userId,
        fKod: randomKod,
        afisSinir: 21,
        slug,
        kurumsal,
        admin: false,
        durum: true,
        olusturmaTarih: new Date().toISOString(),
      });

      const bugun = Timestamp.now();
      const bitisTarih = Timestamp.fromMillis(bugun.toMillis() + 365 * 24 * 60 * 60 * 1000);

      await setDoc(doc(db, `kullanicilar/${userId}/ilan`, '001'), {
        olusturmaTarih: bugun,
        bitisTarih,
      });

      toast.success('Kayıt başarılı. Yönlendiriliyorsunuz...');
      Cookies.set('userToken', userId, { expires: 7 });
      Cookies.set('slug', slug, { expires: 7 });
      setLoading(false);
      navigate('/hesap/panel');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Bu e-posta adresi zaten kullanımda.');
      } else {
        toast.error('Kayıt başarısız oldu. Daha sonra tekrar deneyiniz');
      }
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
      <div className='flex w-full flex-col items-center justify-center gap-3 bg-black pt-2 md:pt-0'>
        <img
          src={logo}
          onClick={() => navigate('/')}
          alt='Logo'
          className='z-50 w-24 cursor-pointer md:w-32'
        />
        <div className='flex w-full flex-col items-center gap-1 pb-20'>
          <p className='text-3xl font-semibold text-yellow-500'>Üyelik</p>
          <p className='text-md font-medium text-gray-400'>Hesap Oluştur</p>
          <form
            className='z-50 mt-5 flex w-full flex-col items-center justify-center gap-1'
            onSubmit={handleSubmit}
          >
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <input
                name='ad'
                value={formData.ad}
                onChange={handleChange}
                autoFocus
                type='text'
                placeholder='Ad Soyad'
                className='z-50 w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
              />
              <input
                name='firma'
                value={formData.firma}
                onChange={handleChange}
                type='text'
                placeholder='Firma'
                className='w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
              />
              <input
                name='gsm'
                value={formData.gsm}
                onChange={handleChange}
                type='text'
                placeholder='GSM'
                className='w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
              />
              <input
                name='email'
                value={formData.email}
                onChange={handleChange}
                type='email'
                placeholder='E-Posta'
                className='w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
              />
              <input
                name='sifre'
                value={formData.sifre}
                onChange={handleChange}
                type='password'
                placeholder='Şifre'
                className='w-80 rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
              />
              <div className='lg:col-span-2'>
                <input
                  name='slug'
                  value={formData.slug}
                  onChange={handleChange}
                  type='text'
                  maxLength={20}
                  placeholder='Kullanıcı Adı (Afiş adresinize eklenecek uzantı)'
                  className='w-full rounded-lg border border-yellow-500 bg-gray-900 p-2 text-center text-neutral-300 outline-none ring-yellow-600 duration-300 focus:ring-2'
                />
                <p className='mt-1.5 text-center text-white'>
                  https://www.kareilan.com/<span className='text-yellow-400'>{formData.slug}</span>
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  className='accent-yellow-400'
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <span onClick={() => setIsModalOpen(true)} className='cursor-pointer text-blue-500'>
                  Kullanıcı Sözleşmesini kabul ediyorum.
                </span>
              </div>
              <button
                type='submit'
                className='rounded-xl bg-yellow-300 py-2 font-semibold text-black md:col-span-2'
              >
                Hesap Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-xl rounded bg-white p-5'>
            <p
              className='mb-0 max-h-60 overflow-hidden overflow-y-auto rounded-lg border bg-neutral-200 p-2'
              dangerouslySetInnerHTML={{ __html: metin.metin }}
            ></p>{' '}
            <button
              className='mt-5 w-full rounded-lg bg-red-500 py-2 font-semibold text-white duration-300 hover:bg-red-600'
              onClick={() => setIsModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilOlustur;
