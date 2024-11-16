import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const NasilKullanilir = ({ show, onClose, sayfa }) => {
  if (!show) return null;

  const [embed, setEmbed] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const veriCek = async () => {
      setLoading(true);
      setError(false);

      try {
        const docRef = doc(db, 'nasilkullanilir', 'video');
        const snapDoc = await getDoc(docRef);

        if (snapDoc.exists()) {
          const data = snapDoc.data();
          if (sayfa === 'afisolustur' && data.afisolustur) {
            setEmbed(data.afisolustur);
          } else if (sayfa === 'profil' && data.profil) {
            setEmbed(data.profil);
          } else if (sayfa === 'afisduzenle' && data.afisduzenle) {
            setEmbed(data.afisduzenle);
          } else if (sayfa === 'sablonlar' && data.sablonlar) {
            setEmbed(data.sablonlar);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Video verisi çekilirken hata:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    veriCek();
  }, [sayfa]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='mb-4 text-xl font-bold'>Nasıl Kullanılır?</h2>
        {loading ? (
          <p className='text-center text-gray-500'>Video yükleniyor...</p>
        ) : error ? (
          <p className='text-center text-red-500'>Video bulunamadı.</p>
        ) : (
          <iframe
            width='100%'
            height='400'
            src={embed}
            title='Nasıl Kullanılır Video'
            className='rounded-md'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        )}
        <button
          onClick={onClose}
          className='mt-4 w-full rounded-lg bg-gradient-to-r from-red-400 to-red-600 py-2 text-white hover:to-red-500'
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default NasilKullanilir;
