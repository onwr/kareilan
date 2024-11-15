import Cookies from 'js-cookie';
import React, { useState } from 'react';
import Profilim from 'src/pages/profil/Profilim';

const Demo = () => {
  const [selectScreen, setSelectScreen] = useState(0);

  const hesapGiris = () => {
    Cookies.set('userToken', 'Tw0EKC0YJdUkPjj1MVEQ3dvxo8k2', { expires: 7 });
    Cookies.set('slug', 'demo', { expires: 7 });
    setTimeout(() => {
      setSelectScreen(1);
    }, 1000);
  };

  return (
    <>
      <p className='mb-5 text-center text-2xl font-semibold'>Sistem Turu</p>
      <div className='container mx-auto flex max-w-screen-xl items-center justify-center rounded-lg border bg-white'>
        {selectScreen === 0 && (
          <div className='flex items-center justify-center py-20'>
            <button
              onClick={hesapGiris}
              className='rounded-xl bg-yellow-400 p-5 font-medium duration-300 hover:bg-yellow-500'
            >
              Demo Hesaba Giriş
            </button>
          </div>
        )}
        {selectScreen === 1 && (
          <div className='relative w-full rounded-xl'>
            <Profilim demo={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default Demo;
