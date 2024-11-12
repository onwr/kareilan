import React from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FaLink, FaQrcode, FaUser } from 'react-icons/fa';

const Work = () => {
  return (
    <div id='nasilcalisir' className='py-10'>
      <h1 className='text-center text-3xl font-bold text-gray-800'>Nasıl Çalışır</h1>
      <p className='text-center text-gray-500'>Üç basit adımda başlayın</p>
      <div className='mx-auto mt-5 flex max-w-screen-xl flex-col items-center gap-2 px-2 md:gap-6 md:px-0 lg:flex-row lg:gap-8'>
        <div className='flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border bg-gradient-to-b from-yellow-500 to-yellow-600 p-14 duration-300 hover:scale-105 md:gap-4'>
          <FaUser className='size-20 text-white' />
          <p className='text-lg font-semibold text-white'>Profil Oluşturun</p>
          <p className='text-center text-sm text-white/80'>
            Telefon, tablet ve bilgisayarınızdan kolayca yönetin ve güncelleyin.
          </p>
        </div>
        <FaArrowRightLong className='my-auto hidden size-24 text-black lg:flex' />
        <div className='flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border bg-gradient-to-b from-yellow-500 to-yellow-600 p-14 duration-300 hover:scale-105 md:gap-4'>
          <FaQrcode className='size-20 text-white' />
          <p className='text-center text-lg font-semibold text-white'>QR Kod Oluşturun</p>
          <p className='text-center text-sm text-white/80'>
            İlk QR kodunuz hediye! Daha fazlasını istediğiniz zaman oluşturabilirsiniz.
          </p>
        </div>
        <FaArrowRightLong className='my-auto hidden size-24 text-black lg:flex' />
        <div className='flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border bg-gradient-to-b from-yellow-500 to-yellow-600 p-14 duration-300 hover:scale-105 md:gap-4'>
          <FaLink className='size-20 text-white' />
          <p className='text-lg font-semibold text-white'>Afişlerinizi Oluşturun</p>
          <p className='text-center text-sm text-white/80'>
            QR kodunuzu afişlerinize ekleyin ve internetteki ilanlarınıza bağlayın.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Work;
