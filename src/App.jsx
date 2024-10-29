import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Giris from './pages/hesap/Giris';
import ProfilOlustur from './pages/hesap/ProfilOlustur';
import IlanDetay from './pages/ilan/IlanDetay';
import FotoIlan from './pages/fotoilan/FotoIlan';
import { Toaster } from 'react-hot-toast';

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/hesap/giris' element={<Giris />} />
        <Route path='/hesap/olustur' element={<ProfilOlustur />} />
        <Route path='/ilan/:id' element={<IlanDetay />} />
        <Route path='/fotoilan/:id' element={<FotoIlan />} />
      </Routes>
    </BrowserRouter>
    <Toaster position='top-center' reverseOrder={false} />
  </>
);

export default App;
