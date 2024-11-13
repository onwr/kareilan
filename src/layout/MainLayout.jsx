import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/db/Firebase';
import toast from 'react-hot-toast';

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userUID = Cookies.get('userToken');

    const checkUser = async () => {
      if (!userUID) {
        navigate('/hesap/giris');
        toast.error('İşlem yapabilmek için lütfen giriş yapınız.');
        return;
      }

      try {
        const userDoc = doc(db, 'kullanicilar', userUID);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
          navigate('/hesap/giris');
          toast.error('İşlem yapabilmek için lütfen giriş yapınız.');
        }
      } catch (error) {
        console.error('Kullanıcı kontrol hatası:', error);
        toast.error('İşlem yapabilmek için lütfen giriş yapınız.');
        navigate('/hesap/giris');
      }
    };

    checkUser();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthLayout;
