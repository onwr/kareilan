import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { db } from 'src/db/Firebase';

const KullaniciIslemleri = () => {
  const [firmaKod, setFirmaKod] = useState('');
  const [firmaAd, setFirmaAd] = useState('');
  const [firmaList, setFirmaList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [kulAd, setKulAd] = useState('');
  const [kulList, setKulList] = useState([]);
  const [showDropdownKul, setShowDropdownKul] = useState(false);
  const [sonuc, setSonuc] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [duzenlenecekBilgi, setDuzenlenecekBilgi] = useState({});
  const [ilanlar, setIlanlar] = useState([]);
  const [ilanGoster, setIlanGoster] = useState(false);
  const [duzenlenenIlan, setDuzenlenenIlan] = useState(null);

  const handleSorgula = async () => {
    if (!firmaKod) {
      toast.error('Lütfen firma kodunu giriniz');
      return;
    }

    try {
      const kulRef = collection(db, 'kullanicilar');
      const q = query(kulRef, where('fKod', '==', parseInt(firmaKod)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('Firma bulunamadı');
        return;
      }

      const data = querySnapshot.docs[0].data();
      const docId = querySnapshot.docs[0].id;
      setSonuc({ ...data, docId });
      setDuzenlenecekBilgi(data);
      console.log(data);
    } catch (error) {
      console.error('Sorgu sırasında hata oluştu: ', error);
      toast.error('Sorgu sırasında hata oluştu');
    }
  };

  const handleFirmaAdiAra = async (input) => {
    if (input.length < 3) {
      setShowDropdown(false);
      return;
    }

    try {
      const kulRef = collection(db, 'kullanicilar');
      const q = query(kulRef, where('firma', '>=', input), where('firma', '<=', input + '\uf8ff'));
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFirmaList(results);
      setShowDropdown(true);
    } catch (error) {
      console.error('Firma arama sırasında hata oluştu:', error);
      toast.error('Arama sırasında hata oluştu');
    }
  };

  const handleKulAdAra = async (input) => {
    if (input.length < 3) {
      setShowDropdownKul(false);
      return;
    }

    try {
      const kulRef = collection(db, 'kullanicilar');
      const q = query(kulRef, where('ad', '>=', input), where('ad', '<=', input + '\uf8ff'));
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setKulList(results);
      setShowDropdownKul(true);
    } catch (error) {
      console.error('Kullanıcı arama sırasında hata oluştu:', error);
      toast.error('Arama sırasında hata oluştu');
    }
  };

  const handleGuncelle = async () => {
    try {
      const firmaRef = doc(db, 'kullanicilar', sonuc.docId);
      await updateDoc(firmaRef, duzenlenecekBilgi);

      toast.success('Firma bilgileri güncellendi!');
      setEditMode(false);
      handleSorgula();
    } catch (error) {
      console.error('Güncelleme sırasında hata oluştu: ', error);
      toast.error('Güncelleme sırasında hata oluştu');
    }
  };

  const handleIlanBilgileri = async () => {
    try {
      const ilanRef = collection(db, 'kullanicilar', sonuc.docId, 'ilan');
      const ilanSnapshot = await getDocs(ilanRef);

      if (ilanSnapshot.empty) {
        toast.error('İlan bulunamadı');
        return;
      }

      const ilanData = ilanSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIlanlar(ilanData);
      setIlanGoster(!ilanGoster);
    } catch (error) {
      console.error('İlan sorgusu sırasında hata oluştu: ', error);
      toast.error('İlan sorgusu sırasında hata oluştu');
    }
  };

  const handleIlanGuncelle = async (ilan) => {
    try {
      const ilanRef = doc(db, 'kullanicilar', sonuc.docId, 'ilan', ilan.id);
      await updateDoc(ilanRef, {
        bitisTarih: ilan.bitisTarih,
      });
      toast.success('İlan bitiş tarihi güncellendi!');
    } catch (error) {
      console.error('İlan güncelleme sırasında hata oluştu: ', error);
      toast.error('İlan güncelleme sırasında hata oluştu');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDuzenlenecekBilgi({
      ...duzenlenecekBilgi,
      [name]: name === 'afisSinir' ? parseInt(value) || 0 : value,
    });
  };

  const handleIlanInputChange = (e, ilan) => {
    const { value } = e.target;
    ilan.bitisTarih = new Date(value);
    setDuzenlenenIlan({ ...ilan });
  };

  return (
    <div className='container flex w-full flex-col items-center gap-2 rounded-xl bg-white p-5'>
      <p className='text-center text-xl font-semibold'>Firma Kodu Giriniz</p>
      <input
        type='number'
        className='mx-auto w-full max-w-md rounded-xl border-2 p-2 text-center outline-none duration-300 focus:border-yellow-400'
        placeholder='Firma Kodu'
        value={firmaKod}
        onChange={(e) => setFirmaKod(e.target.value)}
      />
      <button className='w-full max-w-md rounded-xl bg-yellow-400 py-2' onClick={handleSorgula}>
        Firma Kodu ile Sorgula
      </button>

      <div className='flex w-full max-w-md items-start gap-2'>
        <div className='mt-4 w-full'>
          <input
            type='text'
            className='w-full rounded-xl border-2 p-2 text-center outline-none focus:border-yellow-400'
            placeholder='Firma Adı ile Ara'
            value={firmaAd}
            onChange={(e) => {
              setFirmaAd(e.target.value);
              handleFirmaAdiAra(e.target.value);
            }}
          />
          {showDropdown && firmaList.length > 0 && (
            <div className='mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg'>
              {firmaList.map((firma, index) => (
                <div
                  key={index}
                  className='cursor-pointer p-2 hover:bg-gray-200'
                  onClick={() => {
                    setSonuc({ ...firma, docId: firma.id });
                    setDuzenlenecekBilgi(firma);
                    setFirmaAd(firma.firma);
                    setShowDropdown(false);
                  }}
                >
                  {firma.firma}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-4 w-full'>
          <input
            type='text'
            className='w-full rounded-xl border-2 p-2 text-center outline-none focus:border-yellow-400'
            placeholder='Kullanıcı Adı ile Ara'
            value={kulAd}
            onChange={(e) => {
              setKulAd(e.target.value);
              handleKulAdAra(e.target.value);
            }}
          />
          {showDropdownKul && kulList.length > 0 && (
            <div className='mt-2 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg'>
              {kulList.map((firma, index) => (
                <div
                  key={index}
                  className='cursor-pointer p-2 hover:bg-gray-200'
                  onClick={() => {
                    setSonuc({ ...firma, docId: firma.id });
                    setDuzenlenecekBilgi(firma);
                    setFirmaAd(firma.firma);
                    setShowDropdown(false);
                  }}
                >
                  {firma.ad} - <span className='font-bold'>{firma.firma}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {sonuc?.firma && (
        <div className='w-full'>
          <h3 className='rounded-t-xl bg-orange-300 py-2 text-center font-medium'>
            <span className='font-bold'>{sonuc.fKod}</span> Kodlu Firma Bilgileri
          </h3>
          <div className='border p-4'>
            {editMode ? (
              <>
                <input
                  type='text'
                  name='firma'
                  value={duzenlenecekBilgi.firma}
                  onChange={handleInputChange}
                  className='mb-2 w-full rounded border p-2'
                  placeholder='Firma Ünvanı'
                />
                <input
                  type='text'
                  name='ad'
                  value={duzenlenecekBilgi.ad}
                  onChange={handleInputChange}
                  className='mb-2 w-full rounded border p-2'
                  placeholder='Ad Soyad'
                />
                <input
                  type='text'
                  name='gsm'
                  value={duzenlenecekBilgi.gsm}
                  onChange={handleInputChange}
                  className='mb-2 w-full rounded border p-2'
                  placeholder='GSM'
                />
                <input
                  type='text'
                  name='email'
                  value={duzenlenecekBilgi.email}
                  onChange={handleInputChange}
                  className='mb-2 w-full rounded border p-2'
                  placeholder='E-Posta'
                />
                <input
                  type='number'
                  name='afisSinir'
                  value={duzenlenecekBilgi.afisSinir}
                  onChange={handleInputChange}
                  className='mb-2 w-full rounded border p-2'
                  placeholder='Afiş Oluşturma Sınırı'
                />
                <select
                  name='kurumsal'
                  value={duzenlenecekBilgi.kurumsal ? 'Kurumsal' : 'Bireysel'}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: 'kurumsal', value: e.target.value === 'Kurumsal' },
                    })
                  }
                  className='mb-2 w-full rounded border p-2'
                >
                  <option value='Bireysel'>Bireysel</option>
                  <option value='Kurumsal'>Kurumsal</option>
                </select>

                <select
                  name='admin'
                  value={duzenlenecekBilgi.admin ? 'Admin' : 'Kullanıcı'}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: 'admin', value: e.target.value === 'Admin' },
                    })
                  }
                  className='mb-2 w-full rounded border p-2'
                >
                  <option value='Kullanıcı'>Kullanıcı</option>
                  <option value='Admin'>Admin</option>
                </select>

                <select
                  name='durum'
                  value={duzenlenecekBilgi.durum ? 'Aktif' : 'Pasif'}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: 'durum', value: e.target.value === 'Aktif' },
                    })
                  }
                  className='mb-4 w-full rounded border p-2'
                >
                  <option value='Aktif'>Aktif</option>
                  <option value='Pasif'>Pasif</option>
                </select>

                <button
                  className='mt-2 w-full rounded-lg bg-green-500 py-2 text-white'
                  onClick={handleGuncelle}
                >
                  Güncelle
                </button>
                <button
                  className='mt-2 w-full rounded-lg bg-red-500 py-2 text-white'
                  onClick={() => setEditMode(false)}
                >
                  İptal
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Firma Ünvanı:</strong> {sonuc.firma}
                </p>
                <p>
                  <strong>Ad Soyad:</strong> {sonuc.ad}
                </p>
                <p>
                  <strong>Telefon:</strong> {sonuc.gsm}
                </p>
                <p>
                  <strong>E-posta:</strong> {sonuc.email}
                </p>
                <p>
                  <strong>Afiş Oluşturma Sınırı:</strong> {sonuc.afisSinir}
                </p>
                <p>
                  <strong>Müşteri Tipi:</strong> {sonuc.kurumsal ? 'Kurumsal' : 'Bireysel'}
                </p>
                <p>
                  <strong>Yetki:</strong> {sonuc.admin ? 'Admin' : 'Kullanıcı'}
                </p>
                <p>
                  <strong>Durum:</strong>{' '}
                  <span className={`font-bold ${sonuc.durum ? 'text-green-600' : 'text-red-600'}`}>
                    {sonuc.durum ? 'Aktif' : 'Pasif'}
                  </span>
                </p>
                <p>
                  <strong>Kayıt Tarihi:</strong>{' '}
                  {new Date(sonuc.olusturmaTarih).toLocaleDateString()}
                </p>
                <button
                  className='mt-2 w-full rounded-lg bg-yellow-400 py-2 text-black'
                  onClick={() => setEditMode(true)}
                >
                  Düzenle
                </button>
                <button
                  className='mt-2 w-full rounded-lg bg-black/50 py-2 text-white'
                  onClick={handleIlanBilgileri}
                >
                  İlan Bilgileri
                </button>
              </>
            )}
          </div>

          {ilanGoster && ilanlar.length > 0 && (
            <div className='mt-4'>
              <h4 className='text-lg font-bold'>İlan Sayısı: {ilanlar.length}</h4>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                {ilanlar.map((ilan, index) => (
                  <div key={index} className='mt-2 rounded-xl border bg-yellow-100/20 p-4'>
                    <p>
                      <strong>İlan Başlığı:</strong> {ilan.baslik ? ilan.baslik : 'Bulunamadı'}
                    </p>
                    <p>
                      <strong>İlan Kodu:</strong> {ilan.id}
                    </p>
                    <p>
                      <strong>Oluşturma Tarihi:</strong> <br />
                      {ilan.olusturmaTarih && ilan.olusturmaTarih.toDate
                        ? ilan.olusturmaTarih.toDate().toLocaleDateString('tr-TR')
                        : 'Bulunamadı'}
                    </p>
                    <label>
                      <strong>Bitiş Tarihi:</strong> <br />
                      <input
                        type='date'
                        defaultValue={
                          ilan.bitisTarih && ilan.bitisTarih.toDate
                            ? ilan.bitisTarih.toDate().toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) => handleIlanInputChange(e, ilan)}
                        className='w-full rounded border p-1'
                      />
                    </label>
                    <button
                      className='mt-2 w-full rounded-lg bg-green-500 py-1 text-white'
                      onClick={() => handleIlanGuncelle(ilan)}
                    >
                      Tarihi Güncelle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KullaniciIslemleri;
