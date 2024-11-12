import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';
import { db, storage } from 'src/db/Firebase';
import { LuImagePlus } from 'react-icons/lu';
import toast from 'react-hot-toast';

const FirmaOlustur = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [firmaAdi, setFirmaAdi] = useState('');
  const [kategori, setKategori] = useState('Portal');
  const [kisitliUrl, setKisitliUrl] = useState('');
  const [kisitlar, setKisitlar] = useState([]);

  const handleOlustur = async () => {
    if (!firmaAdi || kisitlar.length === 0) {
      toast.error('Lütfen tüm alanları doldurunuz.');
      return;
    }

    try {
      let uploadedImageUrl = '';
      if (selectedImage) {
        uploadedImageUrl = await uploadImageToStorage(selectedImage);
      }

      const kisitRef = doc(db, 'kisitlar', kategori === 'Portal' ? 'portal' : 'firma');

      await updateDoc(kisitRef, {
        kisitlar: arrayUnion({
          adi: firmaAdi,
          dbName: firmaAdi.toLowerCase(),
          urlPatterns: kisitlar.map((url) => url),
          imageUrl: uploadedImageUrl,
        }),
      });

      toast.success('Başarıyla oluşturuldu!');
      resetForm();
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(error);
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
    const imageRef = ref(storage, `firmaveportal/${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleAddKisit = () => {
    if (kisitliUrl && kisitliUrl.startsWith('https://')) {
      setKisitlar((prev) => [...prev, kisitliUrl]);
      setKisitliUrl('');
    } else {
      toast.error('Lütfen geçerli bir URL girin (https:// ile başlamalı).');
    }
  };

  const handleRemoveKisit = (index) => {
    setKisitlar((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImageUrl('');
    setFirmaAdi('');
    setKisitliUrl('');
    setKisitlar([]);
  };

  return (
    <div className='container w-full max-w-2xl rounded-lg border bg-white p-5'>
      <p className='text-center text-xl font-semibold'>Firma veya Portal Oluştur</p>

      <label className='mt-4 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-neutral-100 p-10 hover:bg-neutral-200'>
        {imageUrl ? (
          <img src={imageUrl} alt='Seçilen Resim' className='h-40 w-auto rounded-xl object-cover' />
        ) : (
          <LuImagePlus className='text-5xl text-gray-400' />
        )}
        <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
      </label>

      <input
        type='text'
        placeholder='Firma veya Portal Adı'
        value={firmaAdi}
        onChange={(e) => setFirmaAdi(e.target.value)}
        className='mt-4 w-full rounded border p-2'
      />

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className='mt-4 w-full rounded border p-2'
      >
        <option value='Portal'>Portal</option>
        <option value='Firma'>Firma</option>
      </select>

      <div className='mt-4'>
        <input
          type='url'
          placeholder='Kısıtlı URL (örn. https://www.sahibinden.com/...)'
          value={kisitliUrl}
          onChange={(e) => setKisitliUrl(e.target.value)}
          className='w-full rounded border p-2'
        />
        <button
          onClick={handleAddKisit}
          className='mt-2 w-full rounded bg-green-600 p-2 text-white hover:bg-green-700'
        >
          Kısıt Ekle
        </button>
      </div>

      {kisitlar.length > 0 && (
        <ul className='mt-4 list-disc rounded-lg bg-neutral-200 p-3'>
          {kisitlar.map((url, index) => (
            <li key={index} className='flex justify-between'>
              {url}
              <button
                onClick={() => handleRemoveKisit(index)}
                className='text-red-600 hover:text-red-800'
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleOlustur}
        className='mt-6 w-full rounded bg-yellow-400 p-3 text-black hover:bg-yellow-500'
      >
        Oluştur
      </button>
    </div>
  );
};

export default FirmaOlustur;
