import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { LuImagePlus } from 'react-icons/lu';
import { db, storage } from 'src/db/Firebase';

const OdemeAyar = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [adres, setAdres] = useState('');

  const handleSablonOlustur = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = '';
      if (selectedImage) {
        uploadedImageUrl = await uploadImageToStorage(selectedImage);
      }

      const odemeRef = collection(db, 'odemeYontem');
      await addDoc(odemeRef, {
        adres,
        link: uploadedImageUrl,
        createdAt: new Date(),
      });

      toast.success('Ödeme yöntemi başarıyla oluşturuldu!');
      setAdres('');
      setSelectedImage(null);
      setImageUrl('');
    } catch (error) {
      console.error('Ödeme yöntemi oluşturulurken hata:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async (file) => {
    const imageRef = ref(storage, `odeme/${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  return (
    <div className='container max-w-screen-lg rounded-xl border border-black/10 bg-white p-5'>
      <p className='text-lg font-bold'>Ödeme Yöntemi Ekle</p>
      <div className='mt-5 flex flex-col gap-3'>
        <label className='flex w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-neutral-100 p-10 hover:bg-neutral-200'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt='Seçilen Resim'
              className='h-32 w-auto rounded-xl bg-cover object-cover'
            />
          ) : (
            <LuImagePlus className='text-5xl text-gray-400' />
          )}
          <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
        </label>

        <div className='w-full flex-1'>
          <form onSubmit={handleSablonOlustur}>
            <div className='mb-4'>
              <label className='block text-sm font-medium'>Yönlendirilecek Adres</label>
              <input
                type='text'
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                placeholder='Yönlendirilecek Adres'
                className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600'
            >
              Yöntem Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OdemeAyar;
