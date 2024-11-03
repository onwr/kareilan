import React, { useState } from 'react';

const IletisimBilgi = ({ onClose, token }) => {
  const [contactInfo, setContactInfo] = useState({
    telefon: '',
    whatsapp: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className='fixed inset-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-70 px-2'>
      <div className='w-full max-w-md rounded-md bg-white p-6'>
        <p className='mb-4 text-lg font-medium'>Mevcut İletişim Bilgileri Ekle</p>

        <input
          type='text'
          name='phone'
          placeholder='Telefon Numarası'
          className='mb-3 w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
          value={contactInfo.phone}
          onChange={handleChange}
        />

        <input
          type='text'
          name='whatsapp'
          placeholder='WhatsApp'
          className='mb-3 w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
          value={contactInfo.whatsapp}
          onChange={handleChange}
        />

        <input
          type='email'
          name='email'
          placeholder='E-posta'
          className='mb-5 w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
          value={contactInfo.email}
          onChange={handleChange}
        />

        <div className='flex justify-end gap-4'>
          <button
            onClick={handleSave}
            className='rounded bg-yellow-400 px-4 py-2 font-semibold text-black duration-300 hover:bg-yellow-500'
          >
            Kaydet
          </button>
          <button
            onClick={onClose}
            className='rounded bg-gray-200 px-4 py-2 font-semibold text-black duration-300 hover:bg-gray-300'
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default IletisimBilgi;
