import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db } from 'src/db/Firebase';
import scan from '../../../images/icons/scan.png';
import QrScanner from 'react-qr-scanner';
import emlakjet from '@images/icons/Emlakjet.svg';
import sahibinden from '@images/icons/sahibinden.svg';
import hepsiemlak from '@images/icons/hepsiemlak.svg';
import zingat from '@images/icons/zingat.svg';
import KW from '@images/icons/KW.svg';
import Century21 from '@images/icons/century21.svg';
import firmasite from '@images/icons/site.svg';
import turyap from '@images/icons/turyap.png';

const firmalar = [
  { name: 'Emlakjet', icon: emlakjet },
  { name: 'Sahibinden', icon: sahibinden },
  { name: 'Hepsi Emlak', icon: hepsiemlak },
  { name: 'Zingat', icon: zingat },
  { name: 'KW', icon: KW },
  { name: 'Century21', icon: Century21 },
  { name: 'Turyap', icon: turyap },
  { name: 'Firma Sitesi', icon: firmasite },
];

const AfisDuzenle = ({ slug, screen, token }) => {
  const [afisLink, setAfisLink] = useState('');
  const [afisData, setAfisData] = useState({});
  const [veriGetirildi, setVeriGetirildi] = useState(false);
  const [docId, setDocId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const afisSorgula = async () => {
    if (!afisLink) {
      toast.error('Lütfen geçerli bir afiş adresi girin!');
      return;
    }

    try {
      const completeLink = `https://kareilan.com/${slug}/${afisLink}`;
      const parts = completeLink.replace('https://kareilan.com/', '').split('/');
      if (parts.length < 2) {
        toast.error('Adres formatı hatalı!');
        return;
      }

      const documentId = parts[1];
      setDocId(documentId);

      const ilanRef = doc(db, `kullanicilar/${token}/ilan/${documentId}`);
      const ilanDoc = await getDoc(ilanRef);

      if (ilanDoc.exists()) {
        setAfisData(ilanDoc.data());
        toast.success('İlan verisi getirildi!');
        setVeriGetirildi(true);
      } else {
        toast.error('Bu numaraya ait ilan bulunamadı.');
      }
    } catch (error) {
      toast.error('Veri sorgulama sırasında hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [company]: !prev[company],
    }));
  };

  const handleCompanyInputChange = (company, value) => {
    setAfisData((prev) => ({
      ...prev,
      [company]: value,
    }));
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAfisData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      if (screen !== 0) {
        screen(0);
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [screen]);

  const handleNestedInputChange = (e, key) => {
    const { name, value } = e.target;
    setAfisData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    if (!docId) return;

    try {
      const ilanRef = doc(db, `kullanicilar/${token}/ilan/${docId}`);
      await updateDoc(ilanRef, afisData);
      toast.success('Veriler başarıyla güncellendi!');
      screen(0);
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu.');
      console.error('Hata:', error);
    }
  };

  const startScan = () => {
    setIsScanning(true);
  };

  const handleScan = (data) => {
    if (data) {
      setAfisLink(data);
      setIsScanning(false);
      toast.success('QR kod başarıyla tarandı!');
      afisSorgula();
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error('Kamera hatası!');
    setIsScanning(false);
  };

  return (
    <div className='mt-5'>
      <div className='flex flex-col items-center'>
        <p className='text-center text-2xl font-semibold underline'>Afişi Düzenle</p>
        {isScanning ? (
          <div className='mt-5 flex flex-col items-center'>
            <p className='mb-2 text-lg font-semibold'>QR Kod Tarayıcı</p>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', borderRadius: '10px' }}
              facingMode={facingMode}
            />
            <button
              onClick={toggleCamera}
              className='mt-4 w-full rounded-xl bg-yellow-500 p-3 font-semibold text-white hover:bg-yellow-700'
            >
              Kamera Modunu Değiştir
            </button>
            <button
              onClick={() => setIsScanning(false)}
              className='mt-4 w-full rounded-xl bg-red-500 p-3 font-semibold text-white hover:bg-red-700'
            >
              İptal Et
            </button>
          </div>
        ) : veriGetirildi ? (
          <form className='mt-5 w-full space-y-6'>
            <div className='space-y-4'>
              <label className='block'>
                <span className='font-semibold'>Afiş Başlığı</span>
                <input
                  type='text'
                  name='baslik'
                  value={afisData.baslik || ''}
                  onChange={handleInputChange}
                  className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                  placeholder='Afiş Başlığı'
                />
              </label>
              <label className='block'>
                <span className='font-semibold'>Afiş Açıklaması</span>
                <textarea
                  type='text'
                  name='aciklama'
                  value={afisData.aciklama || ''}
                  onChange={handleInputChange}
                  className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                  placeholder='Afiş Açıklaması'
                />
              </label>
              <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                {firmalar.map((firma) => (
                  <div key={firma.name} className='mb-4'>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={selectedCompanies[firma.name] || false}
                        onChange={() => handleCompanySelect(firma.name)}
                      />
                      <img src={firma.icon} alt={firma.name} className='h-8 w-8' />
                      <span>{firma.name}</span>
                    </div>

                    {selectedCompanies[firma.name] && (
                      <div className='mt-2'>
                        <input
                          type='text'
                          placeholder={`${firma.name} linki`}
                          value={afisData[firma.name] || ''}
                          onChange={(e) => handleCompanyInputChange(firma.name, e.target.value)}
                          className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className='space-y-1'>
              <p className='font-semibold'>İletişim Bilgileri</p>
              <div className='grid grid-cols-3 gap-1'>
                <label className='block'>
                  <span>WhatsApp</span>
                  <input
                    type='text'
                    name='whatsapp'
                    value={afisData.iletisimBilgi?.whatsapp || ''}
                    onChange={(e) => handleNestedInputChange(e, 'iletisimBilgi')}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='WhatsApp'
                  />
                </label>
                <label className='block'>
                  <span>Telefon</span>
                  <input
                    type='text'
                    name='telefon'
                    value={afisData.iletisimBilgi?.telefon || ''}
                    onChange={(e) => handleNestedInputChange(e, 'iletisimBilgi')}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Telefon'
                  />
                </label>
                <label className='block'>
                  <span>Email</span>
                  <input
                    type='email'
                    name='email'
                    value={afisData.iletisimBilgi?.email || ''}
                    onChange={(e) => handleNestedInputChange(e, 'iletisimBilgi')}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Email'
                  />
                </label>
              </div>
            </div>
            <button
              type='button'
              onClick={handleUpdate}
              className='mt-5 w-full rounded-xl bg-green-500 p-3 font-semibold text-white hover:bg-green-700'
            >
              Güncelle
            </button>

            <button
              onClick={() => screen(0)}
              className='w-full rounded-xl border border-black/30 bg-black/50 p-2 font-semibold text-white duration-300 hover:bg-black/60'
            >
              Geri Dön
            </button>
          </form>
        ) : (
          <>
            <div className='mt-3 flex flex-col items-center gap-1'>
              <p className='text-xl font-semibold'>Afişi Tara</p>
              <img
                className='w-52 cursor-pointer rounded-lg bg-black p-2 duration-300 hover:scale-105'
                src={scan}
                onClick={() => startScan()}
              />
            </div>

            <div className='relative my-5 flex w-full items-center justify-center'>
              <div className='absolute h-1 w-full bg-black'></div>
              <span className='z-50 bg-white px-3 font-bold text-black'>VEYA</span>
            </div>

            <div className='flex flex-col items-center gap-1'>
              <p className='text-xl font-semibold underline'>Afiş Adresi Gir</p>
              <p className='text-xs'>
                Örneğin <span className='text-red-500'>https://kareilan.com/kurkayaemlak/001</span>
              </p>
              <div className='mt-1 flex items-center'>
                <span className='text-gray-500'>https://kareilan.com/{slug}/</span>
                <input
                  autoFocus
                  type='text'
                  value={afisLink}
                  onChange={(e) => setAfisLink(e.target.value)}
                  maxLength={3}
                  className='ml-2 w-16 rounded-md border border-gray-300 px-3 py-1 text-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300'
                  placeholder='001'
                />
              </div>
              <button
                onClick={afisSorgula}
                className='mt-2 w-full rounded-xl border border-black/30 bg-yellow-200 p-2 duration-300 hover:bg-yellow-400'
              >
                Sorgula
              </button>
              <button
                onClick={() => screen(0)}
                className='w-full rounded-xl border border-black/30 bg-black/50 p-2 font-semibold text-white duration-300 hover:bg-black/60'
              >
                Geri Dön
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AfisDuzenle;
