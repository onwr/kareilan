import React, { useState, useRef } from 'react';
import video1 from '../../video/video.mp4';
import video2 from '../../video/video2.mp4';
import { FaPlay, FaPause } from 'react-icons/fa';

const Video = () => {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handlePlayPause1 = () => {
    if (isPlaying1) {
      videoRef1.current.pause();
    } else {
      videoRef1.current.play();
    }
    setIsPlaying1(!isPlaying1);
  };

  const handlePlayPause2 = () => {
    if (isPlaying2) {
      videoRef2.current.pause();
    } else {
      videoRef2.current.play();
    }
    setIsPlaying2(!isPlaying2);
  };

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center justify-center gap-5'>
        <div className='relative w-96'>
          <video ref={videoRef1} className='h-auto w-full rounded-lg shadow-lg' src={video1} />
          <button
            onClick={handlePlayPause1}
            className='absolute inset-0 flex items-center justify-center text-5xl text-yellow-400'
          >
            {isPlaying1 ? <FaPause /> : <FaPlay />}
          </button>
        </div>

        <div className='relative w-96'>
          <video ref={videoRef2} className='h-auto w-full rounded-lg shadow-lg' src={video2} />
          <button
            onClick={handlePlayPause2}
            className='absolute inset-0 flex items-center justify-center text-5xl text-yellow-400'
          >
            {isPlaying2 ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
