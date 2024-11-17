import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { db } from 'src/db/Firebase';

const VideoT = () => {
  const [videoEmbed, setVideoEmbed] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const veriCek = async () => {
      try {
        const docRef = doc(db, 'nasilkullanilir', 'video');
        const getSnap = await getDoc(docRef);
        const videoUrl = getSnap.data().anasayfatanitim;
        setVideoEmbed(videoUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    veriCek();
  }, []);

  return (
    <div className='flex h-screen items-center justify-center'>
      {isLoading ? (
        <div className='flex items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
        </div>
      ) : (
        videoEmbed && (
          <iframe
            src={videoEmbed}
            title='Tanıtım Videosu'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='container h-full w-full md:rounded-xl'
          ></iframe>
        )
      )}
    </div>
  );
};

export default VideoT;
