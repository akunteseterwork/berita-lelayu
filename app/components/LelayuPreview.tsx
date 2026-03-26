'use client';

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

interface PihakBerduka {
  nama: string;
  hubungan: string;
}

interface LelayuData {
  statusAlmarhum: 'almarhum' | 'almarhumah';
  namaAlmarhum: string;
  usia: number | string;
  padukuhan: string;
  kalurahan: string;
  hariMeninggal: string;
  tanggalMeninggal: string;
  jamMeninggal: string;
  hariPemakaman: string;
  tanggalPemakaman: string;
  jamPemakaman: string;
  makamLengkap: string;
  pihakBerduka: PihakBerduka[];
}

interface LelayuPreviewProps {
  data: LelayuData;
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString || dateString.length < 10) return '...';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch (e) {
    return dateString || '...';
  }
};

const LelayuPreview: React.FC<LelayuPreviewProps> = ({ data }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && !isGenerating) {
        const containerWidth = containerRef.current.offsetWidth;
        const padding = containerWidth < 640 ? 20 : 40;
        const availableWidth = containerWidth - padding;
        const newScale = availableWidth / A4_WIDTH_PX;
        setScale(newScale > 1 ? 1 : newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isGenerating]);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const actualHeight = element.scrollHeight;
      const pdfPageWidth = 210;
      const pdfPageHeight = 297;
      const imgHeightInMm = (actualHeight * pdfPageWidth) / A4_WIDTH_PX;

      if (imgHeightInMm > pdfPageHeight) {
        const fontScale = pdfPageHeight / imgHeightInMm;
        element.style.fontSize = `${18 * fontScale}px`;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const scaledHeight = element.scrollHeight;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: A4_WIDTH_PX,
        height: scaledHeight,
        windowWidth: A4_WIDTH_PX,
        windowHeight: scaledHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('print-area');
          if (clonedElement) {
            clonedElement.style.transform = 'scale(1)';
            clonedElement.style.margin = '0';
            clonedElement.style.width = `${A4_WIDTH_PX}px`;
            clonedElement.style.height = `${scaledHeight}px`;
          }
        }
      });

      element.style.fontSize = '';

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const finalHeightInMm = (scaledHeight * pdfPageWidth) / A4_WIDTH_PX;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, finalHeightInMm);
      pdf.save(`Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Capture Error:", error);
      printRef.current!.style.fontSize = '';
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPihakBerduka = data.pihakBerduka.filter(p => p.nama.trim() !== '');


  return (
    <div className="flex flex-col w-full h-full bg-white overflow-hidden">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center bg-white"
      >
        <div
          ref={printRef}
          id="print-area"
          className="bg-white origin-top"
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            padding: '2cm 2.5cm',
            lineHeight: '1.22',
            fontFamily: 'serif',
            color: '#000000',
            fontSize: '20px',
            boxSizing: 'border-box',
            transform: `scale(${isGenerating ? 1 : scale})`,
            marginBottom: isGenerating ? '0px' : `calc(-${A4_HEIGHT_PX}px * (1 - ${scale}))`,
            display: 'block'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <p style={{ fontWeight: '800', fontSize: '1.4em', letterSpacing: '2px', textDecoration: 'underline' }}>PAWARTOS LELAYU</p>
          </div>

          <p style={{ textAlign: 'center', marginBottom: '8px' }}>Assalamualaikum Wr. Wb.</p>

          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <p style={{ fontWeight: '700', fontSize: '1.3em', marginBottom: '2px' }}>إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
            <p style={{ fontSize: '0.85em', fontStyle: 'italic', color: '#555555' }}>INNALILLAHI WA INNA ILAIHI ROJI'UN</p>
          </div>

          <p style={{ margin: '8px 0' }}>Sampun katimbalan sowan wonten Ngarsa Dalem Allah SWT Panjenenganipun:</p>

          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <p style={{ fontSize: '1.4em', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px', textDecoration: 'underline' }}>{data.namaAlmarhum || '...'}</p>
            <p style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '2px' }}>Yuswa: {data.usia || '...'} Tahun</p>
          </div>

          <p style={{ margin: '8px 0' }}>
            Ingkang pidalem wonten ing Padukuhan <strong>{data.padukuhan || '...'}</strong>, Kalurahan {data.kalurahan || '...'}
          </p>

          <p style={{ fontWeight: '700', margin: '8px 0 4px' }}>
            {data.statusAlmarhum === 'almarhum' ? 'Almarhum' : 'Almarhumah'} Seda Rikala:
          </p>
          <div style={{ margin: '4px 0 12px', paddingLeft: '40px' }}>
            {[
              { label: 'Dinten', value: data.hariMeninggal || '...' },
              { label: 'Tanggal', value: formatDate(data.tanggalMeninggal) },
              { label: 'Jam', value: (data.jamMeninggal || '...') + ' WIB' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '90px 10px 1fr', margin: '2px 0' }}>
                <span>{label}</span>
                <span>:</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <p style={{ fontWeight: '700', margin: '8px 0 4px' }}>Jenazah badhe dipun sarekaken wonten ing:</p>
          <div style={{ margin: '4px 0 12px', paddingLeft: '40px' }}>
            {[
              { label: 'Dinten', value: data.hariPemakaman || '...' },
              { label: 'Tanggal', value: formatDate(data.tanggalPemakaman) },
              { label: 'Wanci Jam', value: (data.jamPemakaman || '...') + ' WIB' },
              { label: 'Makam', value: data.makamLengkap || '...' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '90px 10px 1fr', margin: '2px 0' }}>
                <span>{label}</span>
                <span>:</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <p style={{ margin: '8px 0' }}>Mekaten pawartos lelayu punika, mugi saged dados kawuningan.</p>

          <div style={{ marginTop: '12px' }}>
            <p style={{ marginBottom: '6px' }}>Ingkang Nandhang Sungkawa:</p>

            {filteredPihakBerduka.length > 0 ? (() => {
              const longName = filteredPihakBerduka.some(p => p.nama.length > 22);
              const containerWidth = longName ? '80%' : '60%';
              return (
                <div style={{ width: containerWidth }}>
                  {filteredPihakBerduka.map((p, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '3px',
                        gap: '16px',
                      }}
                    >
                      <p style={{ fontWeight: '700', fontSize: '1em', margin: 0, textAlign: 'left', wordBreak: 'break-word', flex: '1' }}>
                        {p.nama}
                      </p>
                      <p style={{ fontSize: '0.93em', fontStyle: 'italic', color: '#333333', margin: 0, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {p.hubungan ? `(${p.hubungan})` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })() : null}

            <p style={{ fontWeight: '700', marginTop: '8px', textDecoration: 'underline' }}>Lan sedaya kulawarga</p>
          </div>

          <p style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic' }}>Wassalamu'alaikum Wr. Wb.</p>
        </div>
      </div>

      <div className="bg-white border-t p-4 sm:p-6 shadow-lg z-30 shrink-0">
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="w-full max-w-lg mx-auto bg-slate-900 hover:bg-black text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:bg-slate-400"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={20} /> Processing...</>
          ) : (
            <><Download size={20} /> Download PDF (Siap Cetak)</>
          )}
        </button>
      </div>
    </div>
  );
};

export default LelayuPreview;