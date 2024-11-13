import React, { useState, useEffect } from 'react';
import { db } from 'src/db/Firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const KullaniciOlustur = () => {
  const [formData, setFormData] = useState({
    fKod: '',
    firma: '',
    ad: '',
    gsm: '',
    email: '',
    slug: '',
    kurumsal: false,
    admin: false,
    olusturulmaTarih: Timestamp.now(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    const formattedSlug = value.replace(/\s+/g, '').toLowerCase();
    setFormData((prevData) => ({
      ...prevData,
      slug: formattedSlug,
    }));
  };

  useEffect(() => {
    if (formData.firma && !formData.fKod) {
      const generatedKod = Math.floor(10000 + Math.random() * 90000);
      setFormData((prevData) => ({
        ...prevData,
        fKod: generatedKod.toString(),
      }));
    }
  }, [formData.firma]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.firma || !formData.ad || !formData.gsm || !formData.email || !formData.slug) {
        toast.error('Tüm alanları doldurmanız gerekmektedir');
        return;
      }

      const docRef = await addDoc(collection(db, 'kullanicilar'), formData);
      toast.success('Kullanıcı başarıyla oluşturuldu!');

      setFormData({
        fKod: '',
        firma: '',
        ad: '',
        gsm: '',
        email: '',
        slug: '',
        kurumsal: false,
        admin: false,
        olusturulmaTarihi: Timestamp.now(),
      });
    } catch (error) {
      console.error('Kullanıcı oluşturulurken hata oluştu:', error);
      toast.error('Kullanıcı oluşturulurken hata oluştu.');
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h2 className='mb-6 text-center text-2xl font-bold text-gray-800'>Kullanıcı Oluştur</h2>
      <motion.form
        onSubmit={handleSubmit}
        className='mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='mb-4'>
          <label htmlFor='fKod' className='block text-gray-700'>
            Firma Kodu
          </label>
          <input
            type='text'
            id='fKod'
            name='fKod'
            value={formData.fKod}
            onChange={handleChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='firma' className='block text-gray-700'>
            Firma Adı
          </label>
          <input
            type='text'
            id='firma'
            name='firma'
            value={formData.firma}
            onChange={handleChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='ad' className='block text-gray-700'>
            Ad
          </label>
          <input
            type='text'
            id='ad'
            name='ad'
            value={formData.ad}
            onChange={handleChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='gsm' className='block text-gray-700'>
            Telefon (GSM)
          </label>
          <input
            type='text'
            id='gsm'
            name='gsm'
            value={formData.gsm}
            onChange={handleChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700'>
            E-Posta
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='slug' className='block text-gray-700'>
            Kullanıcı Adı (Afiş adresinize eklenecek uzantı)
          </label>
          <input
            type='text'
            id='slug'
            name='slug'
            value={formData.slug}
            onChange={handleSlugChange}
            className='mt-2 w-full rounded-lg border border-gray-300 p-3'
            required
          />
        </div>
        <div className='flex items-center gap-5'>
          <div className='mb-4 flex items-center gap-2'>
            <input
              type='checkbox'
              id='kurumsal'
              name='kurumsal'
              checked={formData.kurumsal}
              onChange={handleChange}
            />
            <label htmlFor='kurumsal' className='block text-gray-700'>
              Kurumsal
            </label>
          </div>
          <div className='mb-4 flex items-center gap-2'>
            <input
              type='checkbox'
              id='admin'
              name='admin'
              checked={formData.admin}
              onChange={handleChange}
            />
            <label htmlFor='admin' className='block text-gray-700'>
              Admin
            </label>
          </div>
        </div>
        <motion.button
          type='submit'
          className='mt-4 w-full rounded-lg bg-yellow-500 p-3 text-white hover:bg-yellow-600'
          whileHover={{ scale: 1.05 }}
        >
          Kullanıcı Oluştur
        </motion.button>
      </motion.form>
    </div>
  );
};

export default KullaniciOlustur;
