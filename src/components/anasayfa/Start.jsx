import React from 'react';

const Start = () => {
  return (
    <div className='bg-gradient-to-b from-white to-yellow-200 py-16'>
      <div className='mx-auto max-w-screen-lg text-center text-black'>
        <h1 className='mb-4 text-4xl font-bold'>Hemen Başlayın</h1>
        <p className='mb-8 text-lg'>İlk Afişiniz 1 yıl bizden hediye!</p>
        <a href='/hesap/olustur' className='rounded-lg bg-[#FF9900] px-6 py-2 text-lg text-white'>
          Ücretsiz Üye Ol
        </a>
      </div>
    </div>
  );
};

export default Start;
