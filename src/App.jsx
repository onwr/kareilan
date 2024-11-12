import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Giris from './pages/hesap/Giris';
import ProfilOlustur from './pages/hesap/ProfilOlustur';
import IlanDetay from './pages/ilan/IlanDetay';
import FotoIlan from './pages/fotoilan/FotoIlan';
import { Toaster } from 'react-hot-toast';
import Sablonlar from './pages/Sablonlar';
import Profil from './pages/Profil';
import Yonetici from './pages/Yonetici';
import Anasayfa from './pages/Anasayfa';

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Anasayfa />} />
        <Route path='/hesap/giris' element={<Giris />} />
        <Route path='/hesap/olustur' element={<ProfilOlustur />} />
        <Route path='/ilan/:firma/:id' element={<IlanDetay />} />
        <Route path='/fotoilan/:firma/:id' element={<FotoIlan />} />
        <Route path='/hesap/panel' element={<Profil />} />
        <Route path='/sablonlar' element={<Sablonlar />} />
        <Route path='/yonetici/panel' element={<Yonetici />} />
      </Routes>
    </BrowserRouter>
    <Toaster position='top-center' reverseOrder={false} />
  </>
);

export default App;
