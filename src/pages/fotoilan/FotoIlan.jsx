import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import logo from '@images/logo.png';
import emlakBG from '@images/emlak.jpg';
import emlakResim from '@images/emlakbg.avif';
import sahibinden from '@images/icons/sahibinden.webp';
import hepsiemlak from '@images/icons/hepsiemlak.webp';
import emlakjet from '@images/icons/emlakjet.webp';
import telefon from '@images/icons/telefon.webp';
import whatsapp from '@images/icons/wp.webp';
import mail from '@images/icons/mail.webp';
import youtube from '@images/icons/youtube.png';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import turyap from '@images/icons/turyap.png';

const FotoIlan = () => {
  const { id } = useParams();
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [emlakData] = useState({
    dukkanAd: 'GOP DÜKKAN',
    aciklama: `
AYRANCI ELÇİ SOKAKTA EK YAYA VE ARAÇ TRAFİĞİ GÜZERGAHINDA,
CADDE ÜZERİ KÖŞE BAŞINDA,
NET 150 M2 GİRİŞ 65 M2 GİRİŞ ALTI DEPO KULLANIM ALANI OLAN,
DÜKKANIMIZ SATILIKTIR.
    `,
  });

  const galleryImages = [
    emlakResim,
    emlakResim,
    emlakBG,
    emlakBG,
    emlakBG,
    emlakBG,
    emlakBG,
    emlakResim,
    emlakResim,
    emlakResim,
    emlakResim,
    emlakResim,
    emlakResim,
    emlakResim,
    emlakResim,
  ];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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
            <div className='flex items-center justify-between'>
              <h1 className='text-center text-3xl text-white'>{emlakData.dukkanAd}</h1>
              <div className='flex items-center gap-3'>
                <button
                  className='group rounded-full bg-white px-2 py-1 hover:bg-yellow-500'
                  onClick={scrollPrev}
                >
                  <FaArrowLeft className='text-yellow-400 duration-300 group-hover:text-black' />
                </button>
                <button
                  className='group rounded-full bg-white px-2 py-1 hover:bg-yellow-500'
                  onClick={scrollNext}
                >
                  <FaArrowRight className='text-yellow-400 duration-300 group-hover:text-black' />
                </button>
              </div>
            </div>
            <div className='embla mt-5 cursor-grab active:cursor-grabbing' ref={emblaRef}>
              <div className='embla__container'>
                {galleryImages.map((image, index) => (
                  <div className='embla__slide' key={index}>
                    <img src={image} alt={`gallery-image-${index}`} className='embla__slide__img' />
                  </div>
                ))}
              </div>
            </div>

            <iframe
              className='mt-4 h-auto rounded-xl md:h-[720px]'
              width='100%'
              src='https://www.youtube.com/embed/PJb0E3upl4g'
            ></iframe>

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

      <style jsx>{`
        .embla {
          overflow: hidden;
          max-width: 100%;
        }
        .embla__container {
          display: flex;
          gap: 1rem;
        }
        .embla__slide {
          flex: 0 0 100%;
          max-width: 250px;
        }
        .embla__slide__img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default FotoIlan;
