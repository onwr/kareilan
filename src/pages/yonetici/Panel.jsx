import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SablonEkle from './screens/SablonEkle';
import Sablonlar from './screens/Sablonlar';
import KullaniciIslemleri from './screens/KullaniciIslemleri';
import FirmaOlustur from './screens/FirmaOlustur';
import FirmaPortalList from './screens/FirmaPortalList';
import OdemeAyar from './screens/OdemeAyar';
import OdemeYontemleri from './screens/OdemeYontemleri';
import Firmalar from './screens/Firmalar';
import KullaniciOlustur from './screens/KullaniciOlustur';
import SablonKategori from './screens/SablonKategori';
import IlanFiyat from './screens/IlanFiyat';
import KullaniciSozlesme from './screens/sozlesmeler/KullaniciSozlesme';
import NasilKullanilir from './screens/NasilKullanilir';
import logo2 from '@images/logo2.png';

const Panel = () => {
  const [selectIndex, setSelectedIndex] = useState(0);

  return (
    <div className='flex min-h-screen'>
      <Sidebar screen={setSelectedIndex} />
      <div className='flex w-full flex-1 items-center justify-center bg-gradient-to-b from-white/50 to-black/5'>
        {selectIndex === 0 && <KullaniciIslemleri />}
        {selectIndex === 1 && <SablonEkle />}
        {selectIndex === 2 && <Sablonlar />}
        {selectIndex === 3 && <FirmaOlustur />}
        {selectIndex === 4 && <FirmaPortalList />}
        {selectIndex === 5 && <OdemeAyar />}
        {selectIndex === 6 && <OdemeYontemleri />}
        {selectIndex === 7 && <Firmalar screen={setSelectedIndex} />}
        {selectIndex === 8 && <KullaniciOlustur />}
        {selectIndex === 9 && <SablonKategori />}
        {selectIndex === 10 && <IlanFiyat />}
        {selectIndex === 11 && <KullaniciSozlesme />}
        {selectIndex === 12 && <NasilKullanilir />}
      </div>
      <div className='fixed bottom-0 hidden w-full bg-black py-2 md:block'>
        <img src={logo2} alt='Kürkaya Yazılım' className='mx-auto w-24' />
      </div>
    </div>
  );
};

export default Panel;
