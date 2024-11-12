import React from 'react';
import { MdOutlineHomeWork } from 'react-icons/md';
import { IoPhonePortraitOutline } from 'react-icons/io5';
import { CiCircleCheck } from 'react-icons/ci';

const Features = () => {
  return (
    <div className='py-10'>
      <h1 className='text-center text-2xl font-semibold text-black'>Özellikler</h1>
      <p className='text-center text-black/70'>Emlak işinizi daha verimli hale getirin</p>
      <div className='mx-auto mt-5 flex max-w-screen-xl flex-col items-center gap-2 px-2 md:gap-5 md:px-0 lg:flex-row'>
        <div className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border bg-gradient-to-b from-black/10 to-yellow-800/10 p-16 duration-300 hover:scale-105'>
          <IoPhonePortraitOutline className='size-20 text-black/70' />
          <p className='text-lg font-semibold'>Kolay Kullanım</p>
          <p className='text-center text-sm'>
            Telefon, tablet ve bilgisayarınızdan kolayca yönetin ve güncelleyin.
          </p>
        </div>
        <div className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border bg-gradient-to-b from-black/10 to-yellow-800/10 p-16 duration-300 hover:scale-105'>
          <MdOutlineHomeWork className='size-20 text-black/70' />
          <p className='text-center text-lg font-semibold'>Bir Afiş Pek Çok Taşınmaz</p>
          <p className='text-center text-sm'>
            Afilerinizi farklı taşınmazlarınız için tekrar tekrar kullanın, sadece QR kodunuzu
            güncelleyin
          </p>
        </div>
        <div className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border bg-gradient-to-b from-black/10 to-yellow-800/10 p-16 duration-300 hover:scale-105'>
          <CiCircleCheck className='size-20 text-black/70' />
          <p className='text-lg font-semibold'>Sade ve Şık</p>
          <p className='text-center text-sm'>
            Özel şablonlar ile kurumsal kimliğinize uygun afişler oluşturun.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
