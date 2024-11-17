import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const VideoT = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [butonMetni, setButonMetni] = useState('');
  const [butonAktif, setButonAktif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = doc(db, 'nasilkullanilir', 'video');
        const getSnap = await getDoc(docRef);

        if (getSnap.exists()) {
          const data = getSnap.data();
          setVideoUrl(data.anasayfatanitim || '');
          setButonMetni(data.anasayfaVideoButonMetni || 'Tanıtım Videosunu İzle');
          setButonAktif(data.anasayfaVideoButonAktif || false);
        }
      } catch (error) {
        console.error('Veri çekilirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    veriCek();
  }, []);

  return (
    <div className='flex items-center justify-center'>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
        </div>
      ) : (
        butonAktif &&
        videoUrl && (
          <a
            href={videoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='w-full max-w-3xl rounded-lg bg-gradient-to-r from-red-400 to-red-600 px-6 py-3 text-center font-semibold text-white transition'
          >
            {butonMetni}
          </a>
        )
      )}
    </div>
  );
};

export default VideoT;
