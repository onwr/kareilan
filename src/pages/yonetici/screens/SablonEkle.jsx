import React, { useState } from 'react';
import { LuImagePlus } from 'react-icons/lu';
import { db, storage } from 'src/db/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

const SablonEkle = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [adres, setAdres] = useState('');
  const [category, setCategory] = useState('Dikey');
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async (file) => {
    const imageRef = ref(storage, `sablonlar/${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleSablonOlustur = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = '';
      if (selectedImage) {
        uploadedImageUrl = await uploadImageToStorage(selectedImage);
      }

      const sablonRef = collection(db, 'sablonlar');
      await addDoc(sablonRef, {
        baslik: title,
        type: category,
        aciklama: description,
        adres,
        link: uploadedImageUrl,
        createdAt: new Date(),
      });

      toast.success('Şablon başarıyla oluşturuldu!');
      setTitle('');
      setCategory('Dikey');
      setDescription('');
      setSelectedImage(null);
      setImageUrl('');
    } catch (error) {
      console.error('Şablon oluşturulurken hata:', error);
    }
  };

  return (
    <div className='container w-full rounded-lg border bg-white p-5'>
      <p className='text-xl font-semibold'>Şablon Ekle</p>

      <div className='mt-5 flex flex-col gap-5 lg:flex-row'>
        <label className='flex w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-neutral-100 p-10 hover:bg-neutral-200 lg:w-1/5'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt='Seçilen Resim'
              className='h-full w-full rounded-xl bg-cover object-cover'
            />
          ) : (
            <LuImagePlus className='text-5xl text-gray-400' />
          )}
          <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
        </label>

        <div className='w-full flex-1'>
          <form onSubmit={handleSablonOlustur}>
            <div className='mb-4'>
              <label className='block text-sm font-medium'>Başlık</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Şablon Başlığı'
                className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium'>Canva Adresi</label>
              <input
                type='text'
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                placeholder='Canva Adresi'
                className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
                required
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium'>Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
              >
                <option value='dikey'>Dikey</option>
                <option value='yatay'>Yatay</option>
                <option value='Kare'>Kare</option>
              </select>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium'>Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Şablon açıklaması...'
                className='w-full rounded border p-2 focus:outline-none focus:ring focus:ring-yellow-500'
                rows='4'
              />
            </div>

            <button
              type='submit'
              className='w-full rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600'
            >
              Şablon Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SablonEkle;
