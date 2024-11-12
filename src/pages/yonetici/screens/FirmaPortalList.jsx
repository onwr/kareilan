import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';

const FirmaPortalList = () => {
  const [firmalar, setFirmalar] = useState([]);
  const [portallar, setPortallar] = useState([]);

  const fetchData = async () => {
    try {
      const firmaDocRef = doc(db, 'kisitlar', 'firma');
      const firmaSnapshot = await getDoc(firmaDocRef);
      const firmaData = firmaSnapshot.exists() ? firmaSnapshot.data().kisitlar : [];

      const portalDocRef = doc(db, 'kisitlar', 'portal');
      const portalSnapshot = await getDoc(portalDocRef);
      const portalData = portalSnapshot.exists() ? portalSnapshot.data().kisitlar : [];

      setFirmalar(firmaData);
      setPortallar(portalData);
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu.');
      console.error('Firestore Hatası:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemove = async (type, index) => {
    try {
      const updatedData = type === 'Firma' ? [...firmalar] : [...portallar];
      updatedData.splice(index, 1);

      if (type === 'Firma') {
        setFirmalar(updatedData);
        const firmaDocRef = doc(db, 'kisitlar', 'firma');
        await updateDoc(firmaDocRef, { kisitlar: updatedData });
      } else if (type === 'Portal') {
        setPortallar(updatedData);
        const portalDocRef = doc(db, 'kisitlar', 'portal');
        await updateDoc(portalDocRef, { kisitlar: updatedData });
      }

      toast.success(`${type} başarıyla kaldırıldı!`);
    } catch (error) {
      toast.error('Kaldırma işlemi sırasında bir hata oluştu.');
      console.error('Hata:', error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Firma ve Portal Listesi</h1>

      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-blue-600'>Firmalar</h2>
        {Array.isArray(firmalar) && firmalar.length > 0 ? (
          <ul className='mt-4 list-disc pl-6'>
            {firmalar.map((firma, index) => (
              <li key={index} className='mb-2'>
                <p className='font-medium'>{firma.adi}</p>
                {firma.urlList && firma.urlList.length > 0 && (
                  <ul className='ml-4 list-decimal'>
                    {firma.urlList.map((url, idx) => (
                      <li key={idx}>
                        <a
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-500 underline'
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => handleRemove('Firma', index)}
                  className='mt-2 rounded bg-red-500 px-4 py-2 text-white'
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-600'>Kayıtlı firma bulunamadı.</p>
        )}
      </div>

      <div>
        <h2 className='text-xl font-semibold text-green-600'>Portallar</h2>
        {Array.isArray(portallar) && portallar.length > 0 ? (
          <ul className='mt-4 list-disc pl-6'>
            {portallar.map((portal, index) => (
              <li key={index} className='mb-2'>
                <img src={portal.imageUrl} className='h-20 w-auto' />
                <p className='font-medium'>{portal.adi}</p>
                {portal.urlList && portal.urlList.length > 0 && (
                  <ul className='ml-4 list-decimal'>
                    {portal.urlList.map((url, idx) => (
                      <li key={idx}>
                        <a
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-500 underline'
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => handleRemove('Portal', index)}
                  className='mt-2 rounded bg-red-500 px-4 py-2 text-white'
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-600'>Kayıtlı portal bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default FirmaPortalList;
