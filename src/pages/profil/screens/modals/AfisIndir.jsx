import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import baski from '@images/baski.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AfisIndir = () => {
  const ilanURL = 'https://kareilan.com/ilan/kurkayaemlak/001';

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'pt', 'a0'); // A0 boyutunda PDF
    const content = document.getElementById('afis-content');

    html2canvas(content, { scale: 3 }).then((canvas) => {
      // DPI'yi artırmak için ölçeği yükselttik
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 2383.94; // A0 boyutuna uygun genişlik (pt cinsinden, yaklaşık 841 mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Orantılı yükseklik hesaplama
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); // Sol boşluğu kaldırdık
      heightLeft -= pdf.internal.pageSize.height;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); // Sol boşluğu kaldırdık
        heightLeft -= pdf.internal.pageSize.height;
      }

      pdf.save('kareilan.pdf');
    });
  };

  const downloadImage = () => {
    html2canvas(document.getElementById('afis-content'), { scale: 3 }).then((canvas) => {
      // DPI'yi artırmak için ölçeği yükselttik
      const link = document.createElement('a');
      const imgData = canvas.toDataURL('image/png');

      // A0 boyutlarına uygun resim ayarları
      const imgWidth = 2383.94; // A0 boyutuna uygun genişlik (pt cinsinden)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Orantılı yükseklik hesaplama

      // Yeni bir canvas oluşturup yüksek kaliteli resmi oraya yerleştiriyoruz
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = imgWidth;
      resizedCanvas.height = imgHeight;
      const ctx = resizedCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, imgWidth, imgHeight);

      const resizedImgData = resizedCanvas.toDataURL('image/png');
      link.href = resizedImgData;
      link.download = 'kareilan.png';
      link.click();
    });
  };

  return (
    <div className='absolute inset-0 right-0 top-0 flex min-h-screen items-center justify-center bg-black bg-opacity-50 px-1'>
      <div className='relative z-50 w-full max-w-xl rounded-lg bg-white p-4'>
        <p className='text-center text-xl font-semibold text-black'>Afişi İndir</p>
        <hr className='my-2' />
        <div id='afis-content' className='relative hidden justify-center md:flex'>
          <img src={baski} alt='Baskı' style={{ width: '70%', height: 'auto' }} />
          <div
            className='absolute flex items-center justify-center'
            style={{ top: '47.5%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <QRCodeCanvas value={ilanURL} title={'İlana Gitmek İçin Gereken Karekod'} size={300} />
          </div>
          <p
            className='absolute flex items-center justify-center text-sm font-bold'
            style={{ top: '82%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {ilanURL}
          </p>
        </div>
        <div className='relative flex justify-center md:hidden'>
          <img src={baski} alt='Baskı' style={{ width: '70%', height: 'auto' }} />
          <div
            className='absolute flex items-center justify-center'
            style={{ top: '47.5%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <QRCodeCanvas value={ilanURL} title={'İlana Gitmek İçin Gereken Karekod'} size={180} />
          </div>
          <p
            className='absolute flex items-center justify-center font-bold'
            style={{
              top: '82%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '9.5px',
            }}
          >
            {ilanURL}
          </p>
        </div>
        <hr className='my-2' />
        <div className='flex flex-col items-center justify-center gap-1'>
          <button
            className='w-full rounded-xl border bg-yellow-300 py-2 outline-none duration-300 hover:border-black/40 hover:bg-yellow-200'
            onClick={downloadPDF}
          >
            PDF Olarak İndir
          </button>
          <button
            className='w-full rounded-xl border bg-yellow-300 py-2 duration-300 hover:bg-yellow-200'
            onClick={downloadImage}
          >
            Resim Olarak İndir
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfisIndir;
