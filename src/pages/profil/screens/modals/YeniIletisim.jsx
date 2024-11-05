import React, { useState } from 'react';

const YeniIletisimBilgi = ({ onClose, onSave }) => {
  const [contactInfo, setContactInfo] = useState({
    telefon: '',
    whatsapp: '',
    email: '',
  });

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);

    if (!match) return value;

    return (
      (match[1] ? `(${match[1]}` : '') +
      (match[2] ? `) ${match[2]}` : '') +
      (match[3] ? ` ${match[3]}` : '') +
      (match[4] ? ` ${match[4]}` : '')
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === 'telefon' || name === 'whatsapp' ? formatPhoneNumber(value) : value;

    setContactInfo({ ...contactInfo, [name]: formattedValue });
  };

  const handleSave = () => {
    onSave(contactInfo);
  };

  return (
    <div className='fixed inset-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-70 px-2'>
      <div className='w-full max-w-md rounded-md bg-white p-6'>
        <p className='mb-4 text-lg font-medium'>Yeni İletişim Bilgileri Ekle</p>
        <input
          type='text'
          name='telefon'
          autoFocus
          placeholder='Telefon Numarası'
          className='mb-3 w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
          value={contactInfo.telefon}
          required
          maxLength={15}
          onChange={handleChange}
        />

        <input
          type='text'
          name='whatsapp'
          placeholder='WhatsApp'
          maxLength={15}
          required
          className='mb-3 w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
          value={contactInfo.whatsapp}
          onChange={handleChange}
        />

        <input
          type='email'
          name='email'
          required
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

export default YeniIletisimBilgi;
