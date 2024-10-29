import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '@images/logo.png';
import emlakBG from '@images/emlak.jpg';
import sahibinden from '@images/icons/sahibinden.webp';
import hepsiemlak from '@images/icons/hepsiemlak.webp';
import emlakjet from '@images/icons/emlakjet.webp';
import telefon from '@images/icons/telefon.webp';
import whatsapp from '@images/icons/wp.webp';
import mail from '@images/icons/mail.webp';
import youtube from '@images/icons/youtube.png';
import turyap from '@images/icons/turyap.png';

const IlanDetay = () => {
  const { id } = useParams();
  const [emlakData, setEmlakData] = useState({
    dukkanAd: 'GOP DÜKKAN',
    aciklama: `
AYRANCI ELÇİ SOKAKTA EK YAYA VE ARAÇ TRAFİĞİ GÜZERGAHINDA,
CADDE ÜZERİ KÖŞE BAŞINDA,
NET 150 M2 GİRİŞ 65 M2 GİRİŞ ALTI DEPO KULLANIM ALANI OLAN,
DÜKKANIMIZ SATILIKTIR.
    `,
  });

  return (
    <div
      className='relative min-h-screen'
      style={{
        backgroundImage: `url(${emlakBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1,
      }}
    >
      <div className='relative z-10 flex min-h-screen flex-col items-center bg-black bg-opacity-95 py-5 md:justify-center'>
        <img src={logo} alt='Kareilan' className='w-20 md:w-40' />
        <p className='text-2xl text-primary'>kareilan.com</p>
        <div className='px-5'>
          <div className='container mt-5 max-w-screen-xl rounded-xl bg-white/5 p-3 text-primary ring-4 ring-yellow-200 md:p-4'>
            <h1 className='text-center text-3xl text-white'>{emlakData.dukkanAd}</h1>

            <div
              className='mt-2 text-center text-lg font-medium text-white md:text-justify'
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {emlakData.aciklama}
            </div>

            <div className='mx-auto w-full rounded-xl border px-5 py-2 md:mt-5'>
              <h1 className='text-md text-center font-medium text-primary md:text-xl lg:text-2xl'>
                İlan detayını görüntülemek istediğiniz siteyi seçiniz
              </h1>
              <div className='mt-3 grid grid-cols-3 justify-center gap-5 md:flex md:items-center md:justify-around'>
                <a className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'>
                  <img src={sahibinden} className='w-40' />
                </a>
                <a className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'>
                  <img src={hepsiemlak} className='w-40' />
                </a>
                <a className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'>
                  <img src={emlakjet} className='w-40' />
                </a>
                <a className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'>
                  <img src={turyap} className='w-40' />
                </a>
                <a className='cursor-pointer rounded-xl ring-yellow-400 duration-300 hover:scale-105 hover:ring-2 md:p-1'>
                  <img src={youtube} className='w-40' />
                </a>
              </div>
            </div>

            <div className='mx-auto mt-5 w-full rounded-xl border px-5 py-2'>
              <h1 className='text-md text-center font-medium text-primary md:text-xl lg:text-3xl'>
                İletişim
              </h1>
              <div className='flex items-center justify-around gap-2'>
                <a className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'>
                  <img src={telefon} className='w-32' />
                </a>
                <a className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'>
                  <img src={whatsapp} className='w-32' />
                </a>
                <a className='cursor-pointer rounded-xl p-1 ring-yellow-400 duration-300 hover:scale-105 hover:ring-2'>
                  <img src={mail} className='w-32' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IlanDetay;
