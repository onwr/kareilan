import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db } from 'src/db/Firebase';
import scan from '../../../images/icons/scan.png';
import QrScanner from 'react-qr-scanner';
import { SiCanva } from 'react-icons/si';
import AfisIndir from './modals/AfisIndir';
import { useNavigate } from 'react-router-dom';
import { FaRegCopy } from 'react-icons/fa6';
import NasilKullanilir from './modals/NasilKullanilir';

const AfisDuzenle = ({ slug, screen, token, demo }) => {
  const [afisLink, setAfisLink] = useState('');
  const [afisData, setAfisData] = useState({ links: [] });
  const [veriGetirildi, setVeriGetirildi] = useState(false);
  const [firmaData, setFirmaData] = useState({});
  const [firmalar, setFirmalar] = useState([]);
  const [afisOlusturModal, setAfisOlusturModal] = useState(false);
  const [docId, setDocId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [kurumsalMusteri, setKurumsalMusteri] = useState(false);
  const [howToUseModal, setHowToUseModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFirmalar = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'kisitlar'));
        const firms = [];
        querySnapshot.forEach((doc) => {
          firms.push({ id: doc.id, ...doc.data() });
        });

        if (firms.length === 0) {
          console.warn('Firmalar listesi boş.');
        }

        setFirmalar(firms);
      } catch (error) {
        console.error('Firmalar verisi çekilemedi:', error);
      }
    };
    fetchFirmalar();
  }, []);

  useEffect(() => {
    const kurumsalCheck = async () => {
      try {
        const docRef = doc(db, 'kullanicilar', token);
        const docSnap = await getDoc(docRef);
        setFirmaData(docSnap.data());
        if (docSnap.exists()) {
          const kurumsal = docSnap.data().kurumsal;
          if (kurumsal) {
            setKurumsalMusteri(true);
          } else {
            setKurumsalMusteri(false);
          }
        } else {
          toast.error('Kurumsal üye olmanız gerekmektedir.');
        }
      } catch (error) {
        console.error('Kurumsal bilgi çekme hatası:', error);
      }
    };

    kurumsalCheck();
  }, []);

  const onCloseModal = () => {
    setAfisOlusturModal(false);
  };

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
        setAfisData(ilanDoc.data() || { links: {} });
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

  const afisSorgulaQR = async (afisAdres) => {
    if (demo) {
      toast.error('Demo modunda işlem yapılamaz.');
      return;
    }

    if (!afisAdres) {
      toast.error('Lütfen geçerli bir afiş adresi girin!');
      return;
    }

    try {
      const ilanRef = doc(db, `kullanicilar/${token}/ilan/${afisAdres}`);
      const ilanDoc = await getDoc(ilanRef);

      if (ilanDoc.exists()) {
        setAfisData(ilanDoc.data() || { links: {} });
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

  const handleCopy = () => {
    const link = `https://kareilan.com/${slug}/${afisLink}`;
    navigator.clipboard.writeText(link);
    toast.success('Adres kopyalandı!');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [company]: !prev[company],
    }));
  };

  const handleCompanyInputChange = (company, key, value, imageUrl) => {
    setAfisData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [company]: {
          ...prev.links?.[company],
          [key]: value,
          imageUrl: imageUrl,
        },
      },
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

  const validateUrl = (url, platform) => {
    if (!url) {
      console.log('URL boş olamaz');
      return false;
    }

    if (!Array.isArray(firmalar) || firmalar.length === 0) {
      console.log('Firmalar bulunamadı.');
      return false;
    }

    const selectedPlatform = firmalar.find(
      (item) => item.kisitlar && item.kisitlar.some((kisit) => kisit.dbName === platform)
    );

    if (!selectedPlatform) {
      console.log(`Platform "${platform}" bulunamadı.`);
      return false;
    }

    const platformKisit = selectedPlatform.kisitlar.find((kisit) => kisit.dbName === platform);

    if (!platformKisit || !platformKisit.urlPatterns) {
      console.log(`Platform "${platform}" için URL pattern bulunamadı.`);
      return false;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const regexPatterns = platformKisit.urlPatterns.map((pattern) => new RegExp(pattern));

    for (const pattern of regexPatterns) {
      if (pattern.test(url)) {
        console.log('URL matches pattern:', pattern);
        return true;
      }
    }

    console.log('Doğrulama başarısız:', url);
    return false;
  };

  const handleUpdate = async () => {
    if (demo) {
      toast.error('Demo modunda işlem yapılamaz.');
      return;
    }

    if (!docId) {
      console.error('docId bulunamadı.');
      return;
    }

    try {
      console.log('Güncelleme başlatıldı');
      console.log('Afis Data:', afisData);
      console.log('Firmalar:', firmalar);

      const cleanedLinks = {};
      Object.keys(afisData.links || {}).forEach((platform) => {
        const link = afisData.links[platform]?.link;
        if (link && typeof link === 'string' && link.trim() !== '') {
          cleanedLinks[platform] = afisData.links[platform];
        }
      });

      afisData.links = cleanedLinks;

      for (const data of firmalar) {
        if (data.kisitlar) {
          for (const kisit of data.kisitlar) {
            const platformUrl =
              afisData.links?.[kisit.dbName]?.link || afisData.links?.[kisit.dbName];

            if (platformUrl === undefined) {
              console.warn(`Uyarı: ${kisit.dbName} için URL bulunamadı, kontrol atlanıyor.`);
              continue;
            }

            console.log(`Kontrol Ediliyor - Platform: ${kisit.dbName}, URL:`, platformUrl);

            if (typeof platformUrl !== 'string' || !platformUrl) {
              console.error(
                `Hata: ${kisit.dbName} için URL bir string değil veya boş:`,
                platformUrl
              );
              toast.error(`Geçersiz ${kisit.adi} URL formatı.`);
              return;
            }

            const isValid = validateUrl(platformUrl, kisit.dbName);
            console.log(`URL doğrulandı mı (${kisit.dbName}):`, isValid);

            if (!isValid) {
              toast.error(`Geçersiz ${kisit.adi} URL'si.`);
              return;
            }
          }
        }
      }

      const ilanRef = doc(db, `kullanicilar/${token}/ilan/${docId}`);
      await updateDoc(ilanRef, afisData);
      toast.success('Veriler başarıyla güncellendi!');
    } catch (error) {
      console.error('Güncelleme sırasında hata oluştu:', error);
      toast.error('Güncelleme sırasında hata oluştu.');
    }
  };

  const startScan = () => {
    setIsScanning(true);
  };

  const handleScan = (data) => {
    console.log('Scanned data:', data);
    if (data) {
      const lastPart = data.text.split('/').pop();

      toast.success('QR kod başarıyla tarandı!');
      setTimeout(() => {
        afisSorgulaQR(lastPart);
      }, 1000);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    toast.error('Kamera hatası!');
    setIsScanning(false);
  };

  return (
    <div className='relative mt-5'>
      <div className='flex flex-col items-center'>
        <button
          onClick={() => setHowToUseModal(true)}
          className='absolute right-0 top-0 cursor-pointer rounded-lg bg-gradient-to-r from-red-400 to-red-600 p-2 text-xs text-white hover:to-red-200'
        >
          Nasıl Kullanılır
        </button>
        <p className='text-center text-2xl font-semibold underline'>Afişi Düzenle</p>
        {isScanning ? (
          <div className='mt-5 flex flex-col items-center'>
            <p className='mb-2 text-lg font-semibold'>QR Kod Tarayıcı</p>
            <QrScanner
              delay={300}
              onError={handleError}
              constraints={{
                video: { facingMode: facingMode },
              }}
              onScan={handleScan}
              style={{ width: '100%', borderRadius: '10px' }}
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
          <form className='relative mt-5 w-full space-y-2'>
            <div className='space-y-4'>
              <label className='block'>
                <span className='font-semibold'>İlan Başlığı</span>
                <input
                  type='text'
                  name='baslik'
                  value={afisData.baslik || ''}
                  onChange={handleInputChange}
                  className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                  placeholder='İlan Başlığı'
                />
              </label>
              <label className='block'>
                <span className='font-semibold'>İlan Açıklaması</span>
                <textarea
                  type='text'
                  name='aciklama'
                  value={afisData.aciklama || ''}
                  onChange={handleInputChange}
                  className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                  placeholder='İlan Açıklaması'
                />
              </label>
              <div>
                <h2 className='mb-4 text-xl font-bold'>Portallar</h2>
                <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                  {firmalar
                    .filter((firma) => firma.type === 'portal')
                    .flatMap((firma) => firma.kisitlar || [])
                    .map((kisit) => (
                      <div key={kisit.dbName} className='mb-4'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            checked={selectedCompanies[kisit.dbName] || false}
                            onChange={() => handleCompanySelect(kisit.dbName)}
                          />
                          <img src={kisit.imageUrl} alt={kisit.adi} className='h-8 w-8' />
                          <span>{kisit.adi}</span>
                        </div>
                        {selectedCompanies?.[kisit.dbName] && (
                          <div className='mt-2'>
                            <input
                              type='text'
                              placeholder={`${kisit.adi} linki`}
                              value={afisData?.links?.[kisit.dbName]?.link || ''}
                              onChange={(e) =>
                                handleCompanyInputChange(
                                  kisit.dbName,
                                  'link',
                                  e.target.value,
                                  kisit.imageUrl
                                )
                              }
                              className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                <h2 className='mb-4 text-xl font-bold'>Firmalar</h2>
                <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                  {firmalar
                    .filter((firma) => firma.type === 'firma')
                    .flatMap((firma) => firma.kisitlar || [])
                    .map((kisit) => (
                      <div key={kisit.dbName} className='mb-4'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            checked={selectedCompanies[kisit.dbName] || false}
                            onChange={() => handleCompanySelect(kisit.dbName)}
                          />
                          <img src={kisit.imageUrl} alt={kisit.adi} className='h-8 w-8' />
                          <span>{kisit.adi}</span>
                        </div>
                        {selectedCompanies?.[kisit.dbName] && (
                          <div className='mt-2'>
                            <input
                              type='text'
                              placeholder={`${kisit.adi} linki`}
                              value={afisData?.links?.[kisit.dbName]?.link || ''}
                              onChange={(e) =>
                                handleCompanyInputChange(
                                  kisit.dbName,
                                  'link',
                                  e.target.value,
                                  kisit.imageUrl
                                )
                              }
                              className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <p className='font-bold'>İlan Sahibi Bilgileri</p>
              <div className='mt-1 flex flex-col gap-2 md:flex-row'>
                <div className='flex w-full flex-col items-center justify-center gap-0.5 rounded-lg border py-2 shadow md:px-5'>
                  <p className='font-medium'>Firma Adı</p>
                  <p className='font-bold'>{firmaData.firma}</p>
                </div>
                <div className='flex w-full flex-col gap-0.5'>
                  <p className='font-medium'>Kullanıcı Adı</p>
                  <input
                    type='text'
                    name='musteri'
                    value={afisData.musteri || ''}
                    onChange={handleInputChange}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Kullanıcı Adı'
                  />
                </div>
              </div>
            </div>

            <div className='space-y-1'>
              <p className='font-bold'>İletişim Bilgileri</p>
              <div
                onClick={() => {
                  if (!kurumsalMusteri) {
                    toast.error(
                      'Sadece kurumsal kullanıcılar afişe özel bilgi girebilir. Afişlerinizdeki bilgileri profil kısmından yönetebilirsiniz'
                    );
                  }
                }}
                className='grid grid-cols-3 gap-1'
              >
                <label className='block'>
                  <span>GSM No</span>
                  <input
                    type='text'
                    name='telefon'
                    disabled={!kurumsalMusteri}
                    value={afisData.iletisimBilgi?.telefon || ''}
                    onChange={(e) => handleNestedInputChange(e, 'iletisimBilgi')}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='GSM No'
                  />
                </label>
                <label className='block'>
                  <span>Email</span>
                  <input
                    type='email'
                    name='email'
                    disabled={!kurumsalMusteri}
                    value={afisData.iletisimBilgi?.email || ''}
                    onChange={(e) => handleNestedInputChange(e, 'iletisimBilgi')}
                    className='w-full rounded border p-2 outline-none ring-yellow-300 duration-300 focus:ring-2'
                    placeholder='Email'
                  />
                </label>
              </div>
            </div>

            <div className='mt-2 grid grid-cols-1 items-center justify-center gap-2 md:grid-cols-2 lg:flex'>
              <button
                type='button'
                onClick={() => setAfisOlusturModal(true)}
                className='w-full rounded-lg border-2 border-yellow-400 px-2 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:px-5 md:text-base'
              >
                Afişi İndir
              </button>
              <a
                target='_blank'
                href='/sablonlar'
                className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-yellow-400 px-5 py-2 text-xs font-medium duration-300 hover:bg-yellow-100 md:text-base'
              >
                Şablonlara Git <SiCanva size='24' />
              </a>
            </div>
            <div className='mx-auto flex items-center justify-center gap-2 rounded-xl bg-yellow-300 px-5 py-2'>
              kareilan.com/{slug}/{afisLink}{' '}
              <FaRegCopy
                onClick={handleCopy}
                className='cursor-pointer text-black/50 duration-300 hover:text-black'
              />
            </div>
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={handleUpdate}
                className='w-full rounded-xl bg-green-500 p-2 font-semibold text-white duration-300 hover:bg-green-700'
              >
                Güncelle
              </button>

              <button
                onClick={() => screen(0)}
                className='w-full rounded-xl bg-black/50 p-2 font-semibold text-white duration-300 hover:bg-black/70'
              >
                Geri Dön
              </button>
            </div>
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
      <NasilKullanilir
        show={howToUseModal}
        onClose={() => setHowToUseModal(false)}
        sayfa='afisduzenle'
      />
      {afisOlusturModal && <AfisIndir slug={slug} docId={docId} onClose={onCloseModal} />}
    </div>
  );
};

export default AfisDuzenle;
