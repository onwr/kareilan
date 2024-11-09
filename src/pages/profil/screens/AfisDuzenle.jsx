import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { db } from 'src/db/Firebase';
import scan from '../../../images/icons/scan.png';
import QrScanner from 'react-qr-scanner';

const AfisDuzenle = ({ screen, token }) => {
  const [afisLink, setAfisLink] = useState('');
  const [afisData, setAfisData] = useState({});
  const [veriGetirildi, setVeriGetirildi] = useState(false);
  const [docId, setDocId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const afisSorgula = async () => {
    if (!afisLink) {
      toast.error('Lütfen geçerli bir afiş adresi girin!');
      return;
    }

    try {
      const parts = afisLink.replace('https://kareilan.com/', '').split('/');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAfisData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            />
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

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <label className='block'>
                  <span className='font-semibold'>Sahibinden Linki</span>
                  <input
                    type='text'
                    name='hepsiemlak'
                    value={afisData.sahibinden || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Hepsiemlak Linki'
                  />
                </label>
                <label className='block'>
                  <span className='font-semibold'>Hepsiemlak Link</span>
                  <input
                    type='text'
                    name='kurumsal'
                    value={afisData.hepsiemlak || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Kurumsal Link'
                  />
                </label>
                <label className='block'>
                  <span className='font-semibold'>Emlakjet Linki</span>
                  <input
                    name='emlakjet'
                    value={afisData.emlakjet || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Emlakjet Linki'
                  />
                </label>
                <label className='block'>
                  <span className='font-semibold'>Zingat Linki</span>
                  <input
                    name='emlakjet'
                    value={afisData.zingat || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Zingat Linki'
                  />
                </label>
                <label className='block'>
                  <span className='font-semibold'>Kurumsal Link</span>
                  <input
                    name='emlakjet'
                    value={afisData.kurumsal || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Emlakjet Linki'
                  />
                </label>
                <label className='block'>
                  <span className='font-semibold'>Firma İlan</span>
                  <input
                    name='emlakjet'
                    value={afisData.firmaLink || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Zingat Linki'
                  />
                </label>
              </div>
            </div>
            <div className='space-y-4'>
              <p className='font-semibold'>İletişim Bilgileri</p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                <label className='block md:col-span-2'>
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
              <input
                type='text'
                value={afisLink}
                onChange={(e) => setAfisLink(e.target.value)}
                className='mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300'
                placeholder='Afiş Adresi'
              />
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
