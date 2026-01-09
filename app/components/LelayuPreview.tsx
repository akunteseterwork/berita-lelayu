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
  namaAlmarhum: string;
  usia: number | string;
  padukuhan: string;
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
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('print-area');
          if (clonedElement) {
            clonedElement.style.transform = 'scale(1)';
            clonedElement.style.margin = '0';
            clonedElement.style.width = `${A4_WIDTH_PX}px`;
            clonedElement.style.height = `${A4_HEIGHT_PX}px`;
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Capture Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPihakBerduka = data.pihakBerduka.filter(p => p.nama.trim() !== '');

  const useGrid = filteredPihakBerduka.length > 3;

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
            lineHeight: '1.6',
            fontFamily: 'serif',
            color: '#000000',
            fontSize: '18px',
            boxSizing: 'border-box',
            transform: `scale(${isGenerating ? 1 : scale})`,
            marginBottom: isGenerating ? '0px' : `calc(-${A4_HEIGHT_PX}px * (1 - ${scale}))`,
            display: 'block'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <p style={{ fontWeight: '800', fontSize: '28px', letterSpacing: '2px' }}>PAWARTOS LELAYU</p>
          </div>

          <p style={{ textAlign: 'center', marginBottom: '10px' }}>Assalamualaikum Wr. Wb.</p>

          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <p style={{ fontWeight: '700', fontSize: '24px', marginBottom: '2px' }}>إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
            <p style={{ fontSize: '16px', fontStyle: 'italic', color: '#555555' }}>INNALILLAHI WA INNA ILAIHI ROJI'UN</p>
          </div>

          <p style={{ textAlign: 'center', margin: '10px 0' }}>Sampun katimbalan sowan wonten ngarso dalem Allah SWT Panjenenganipun:</p>

          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <p style={{ fontSize: '32px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>{data.namaAlmarhum || '...'}</p>
            <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '2px' }}>Yuswa: {data.usia || '...'} Tahun</p>
            <p>Ingkang pidalem wonten ing Padukuhan <strong>{data.padukuhan || '...'}</strong>, Kalurahan Krembangan</p>
          </div>

          <div style={{ margin: '15px 0', textAlign: 'center' }}>
            <p style={{ fontWeight: '700', marginBottom: '2px' }}>Almarhum Sedo Rikolo:</p>
            <p>Dinten : <strong>{data.hariMeninggal || '...'}</strong></p>
            <p>Tanggal : <strong>{formatDate(data.tanggalMeninggal)}</strong></p>
            <p>Wanci Jam : <strong>{(data.jamMeninggal || '...') + ' WIB'}</strong></p>
          </div>

          <div style={{ margin: '15px 0', textAlign: 'center' }}>
            <p style={{ fontWeight: '700', marginBottom: '2px' }}>Jenazah Badhe Dipun-makamaken Wonten Ing:</p>
            <p>Dinten : <strong>{data.hariPemakaman || '...'}</strong></p>
            <p>Tanggal : <strong>{formatDate(data.tanggalPemakaman)}</strong></p>
            <p>Wanci Jam : <strong>{(data.jamPemakaman || '...') + ' WIB'}</strong></p>
            <p>Makam : <strong>{data.makamLengkap || '...'}</strong></p>
          </div>

          <p style={{ textAlign: 'center', margin: '15px 0' }}>Mekaten atur pawartos lelayu meniko, mugi saget ndadosaken pamrikso.</p>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontWeight: '700', marginBottom: '8px' }}>Ingkang Nandang Sungkowo:</p>

            {filteredPihakBerduka.length > 0 ? (
              <div
                style={{
                  display: useGrid ? 'grid' : 'block',
                  justifyItems: 'center',
                  gridTemplateColumns: useGrid ? '1fr 1fr' : 'none',
                  gap: useGrid ? '5px 20px' : 'none',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  maxWidth: '90%',
                  margin: '0 auto'
                }}
              >
                {filteredPihakBerduka.map((p, index) => (
                  <p key={index} style={{ marginBottom: '2px', fontSize: '17px', textAlign: useGrid ? 'left' : 'center' }}>
                    <span style={{ fontWeight: '600' }}>{p.nama}</span>
                    {p.hubungan && (
                      <span style={{ marginLeft: '8px', fontSize: '15px', fontStyle: 'italic', color: '#555555' }}>
                        ({p.hubungan})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            ) : <p className="italic text-gray-400">(Data Keluarga Kosong)</p>}

            <p style={{ fontWeight: '700', marginTop: '10px' }}>Lan Sedoyo Keluargo</p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>Wassalamu'alaikum Wr. Wb.</p>
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