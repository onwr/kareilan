import React, { useState, useEffect, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { db } from 'src/db/Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const KullaniciSozlesme = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  // Firestore'dan sözleşme metnini çekme
  const fetchSozlesme = async () => {
    try {
      const dbRef = doc(db, 'sozlesme', 'kullanici');
      const docSnap = await getDoc(dbRef);

      if (docSnap.exists()) {
        setContent(docSnap.data().metin);
      } else {
        console.log('Sözleşme metni bulunamadı');
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  useEffect(() => {
    fetchSozlesme();
  }, []);

  const handleGuncelle = async () => {
    try {
      const dbRef = doc(db, 'sozlesme', 'kullanici');
      await setDoc(dbRef, { metin: content });

      toast.success('Sözleşme metni başarıyla güncellendi');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Güncelleme sırasında bir hata oluştu');
    }
  };

  return (
    <div className='container w-full max-w-screen-lg rounded-lg bg-white p-5 md:border'>
      <p className='mb-4 text-xl font-semibold'>Kullanıcı Sözleşmesi</p>
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
        config={{
          readonly: false,
          height: 400,
          placeholder: 'Kullanıcı sözleşmesi metnini buraya yazınız...',
        }}
      />
      <button
        onClick={handleGuncelle}
        className='mt-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
      >
        Güncelle
      </button>
    </div>
  );
};

export default KullaniciSozlesme;
