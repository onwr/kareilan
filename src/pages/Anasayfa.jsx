import Features from '@components/anasayfa/Features';
import Hero from '@components/anasayfa/Hero';
import HowItWork from '@components/anasayfa/HowItWork';
import Start from '@components/anasayfa/Start';
import Video from '@components/anasayfa/Video';
import Footer from '@components/Footer';
import React from 'react';

const Anasayfa = () => {
  return (
    <div>
      <Hero />
      <Video />
      <Features />
      <HowItWork />
      <Start />
      <Footer />
    </div>
  );
};

export default Anasayfa;
