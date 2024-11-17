import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const VideoT = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [butonMetni, setButonMetni] = useState('');
  const [butonAktif, setButonAktif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex items-center justify-center'>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
        </div>
      ) : (
        butonAktif &&
        videoUrl && (
          <>
            <button
              onClick={openModal}
              className='w-full max-w-3xl rounded-lg bg-gradient-to-r from-red-400 to-red-600 px-6 py-3 text-center font-semibold text-white transition'
            >
              {butonMetni}
            </button>

            {isModalOpen && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='relative w-full max-w-2xl rounded-lg bg-white shadow-lg'>
                  <div className='p-4'>
                    <iframe
                      width='100%'
                      height='400'
                      src={videoUrl}
                      title='Nasıl Kullanılır Video'
                      className='rounded-md'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={closeModal}
                      className='mt-4 w-full rounded-lg bg-gradient-to-r from-red-400 to-red-600 py-2 text-white hover:to-red-500'
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default VideoT;
