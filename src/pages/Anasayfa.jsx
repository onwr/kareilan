import Features from '@components/anasayfa/Features';
import Hero from '@components/anasayfa/Hero';
import HowItWork from '@components/anasayfa/HowItWork';
import Start from '@components/anasayfa/Start';
import React from 'react';

const Anasayfa = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWork />
      <Start />
    </div>
  );
};

export default Anasayfa;
