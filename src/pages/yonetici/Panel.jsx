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
      </div>
    </div>
  );
};

export default Panel;
