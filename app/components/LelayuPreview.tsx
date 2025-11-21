'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

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

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const downloadButton = document.getElementById('download-btn');
    if (downloadButton) downloadButton.style.display = 'none';
    
    element.scrollIntoView({ behavior: 'smooth' }); 
    
    const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true, 
        allowTaint: true, 
        windowHeight: element.scrollHeight, 
        ignoreElements: (el) => el.id === 'download-btn',
    }); 
    
    if (downloadButton) downloadButton.style.display = 'flex';

    const imgData = canvas.toDataURL('image/jpeg', 1.0); 
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    const pdfWidth = pdf.internal.pageSize.getWidth(); 
    const pdfHeight = pdf.internal.pageSize.getHeight(); 
    
    const canvasRatio = canvas.height / canvas.width;
    const imgHeight = pdfWidth * canvasRatio;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) { 
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
    }
    
    const fileName = `Pawartos_Lelayu_${data.namaAlmarhum.replace(/\s/g, '_')}.pdf`;
    pdf.save(fileName);
  };

  const tanggalMatiFormatted = formatDate(data.tanggalMeninggal);
  const tanggalKuburFormatted = formatDate(data.tanggalPemakaman);
  
  const filteredPihakBerduka = data.pihakBerduka.filter(p => p.nama.trim() !== '');

  const AlignedRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
      <span style={{ minWidth: '110px', maxWidth: '110px', textAlign: 'right', fontSize: '13.5px' }}>
        {label}
      </span>
      <span style={{ margin: '0 12px', fontSize: '13.5px', fontWeight: 'bold' }}>
        :
      </span>
      <span style={{ fontWeight: '600', textAlign: 'left', fontSize: '13.5px' }}>
        {value}
      </span>
    </div>
  );


  return (
    <div className="mt-8 max-w-full">
      <div
        ref={printRef}
        className="rounded-lg" 
        style={{ 
            width: '210mm', 
            height: 'auto',
            minHeight: '0', 
            padding: '2.5cm 3cm', 
            lineHeight: '1.4', 
            border: '1px solid #dddddd',
            backgroundColor: '#ffffff',
            margin: '0 auto',
            fontFamily: 'serif', 
            color: '#000000',
            fontSize: '13.5px', 
            boxSizing: 'border-box'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ 
              fontWeight: '800', 
              fontSize: '20px', 
              marginBottom: '5px',
              letterSpacing: '2px',
          }}>
            PAWARTOS LELAYU
          </p>
          <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#555555' }}>
            (Berita Dukacita)
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13.5px', marginBottom: '12px' }}>
          Assalamualaikum Wr. Wb.
        </p>
        
        <div style={{ textAlign: 'center', margin: '12px 0' }}>
          <p style={{ 
              fontWeight: '700', 
              fontSize: '16px', 
              color: '#000000',
              letterSpacing: '1px',
              marginBottom: '4px'
          }}>
            إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
          </p>
          <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#555555' }}>
            INNALILLAHI WA INNA ILAIHI ROJI'UN
          </p>
        </div>
        
        <p style={{ 
            textAlign: 'center', 
            marginTop: '12px',
            marginBottom: '15px',
            fontSize: '13.5px'
        }}>
          Sampun katimbalan sowan wonten ngarso dalem Allah SWT Panjenenganipun:
        </p>
        
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <p style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px'
          }}>
            {data.namaAlmarhum || '{{nama_almarhum}}'}
          </p>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
            Yuswa: {data.usia || '{{usia}}'} Taun
          </p>
          <p style={{ fontSize: '13.5px' }}>
            Ingkang pidalem wonten ing Padukuhan <strong>{data.padukuhan || '{{padukuhan}}'}</strong>, Kalurahan Krembangan
          </p>
        </div>

       <div style={{ marginTop: '18px', marginBottom: '15px', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', marginBottom: '6px', fontSize: '14px', color: '#333333' }}>
            Almarhum Sedo Rikolo:
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Dinten : <span style={{ fontWeight: '600' }}>{data.hariMeninggal || '...'}</span>
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Tanggal : <span style={{ fontWeight: '600' }}>{tanggalMatiFormatted || '...'}</span>
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Wanci Jam : <span style={{ fontWeight: '600' }}>{(data.jamMeninggal || '...') + ' WIB'}</span>
          </p>
        </div>

        <div style={{ marginTop: '15px', marginBottom: '18px', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', marginBottom: '6px', fontSize: '14px', color: '#333333' }}>
            Jenazah Badhedipun Makamaken Wonten Ing:
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Dinten : <span style={{ fontWeight: '600' }}>{data.hariPemakaman || '...'}</span>
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Tanggal : <span style={{ fontWeight: '600' }}>{tanggalKuburFormatted || '...'}</span>
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Wanci Jam : <span style={{ fontWeight: '600' }}>{(data.jamPemakaman || '...') + ' WIB'}</span>
          </p>
          <p style={{ margin: '2px 0', fontSize: '13.5px' }}>
            Makam : <span style={{ fontWeight: '600' }}>{data.makamLengkap || '...'}</span>
          </p>
        </div>

        <p style={{ 
            textAlign: 'center',
            marginTop: '18px',
            marginBottom: '20px',
            fontSize: '13.5px'
        }}>
          Mekaten atur pawartos lelayu meniko, mugi saget ndadosaken pamrikso.
        </p>

        <div style={{ 
            marginTop: '20px',
            display: 'flex', 
            justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', minWidth: '300px' }}>
            <p style={{ 
                fontWeight: '700', 
                marginBottom: '8px',
                fontSize: '14px',
                paddingBottom: '5px',
                display: 'inline-block'
            }}>
              Ingkang Nandang Sungkowo:
            </p>
            {filteredPihakBerduka.length > 0 ? (
                <div style={{ marginTop: '5px', textAlign: 'center', lineHeight: '1.4' }}> 
                  {filteredPihakBerduka.map((p, index) => (
                      <p key={index} style={{ marginBottom: '2px', fontSize: '13.5px' }}>
                          <span style={{ fontWeight: '600' }}>
                            {p.nama}
                          </span>
                          {p.hubungan && (
                              <span style={{ marginLeft: '8px', fontSize: '12.5px', fontStyle: 'italic', color: '#555555' }}>
                                  ({p.hubungan})
                              </span>
                          )}
                      </p>
                  ))}
                </div>
            ) : (
                <p style={{ color: '#666666', fontSize: '12px', fontStyle: 'italic' }}>
                  (Data Pihak Berduka tidak diisi)
                </p>
            )}
          </div>
        </div>
        
        <p style={{ 
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '13.5px'
        }}>
          Wassalamu'alaikum Wr. Wb.
        </p>
      </div>

      <div className="mt-6 flex justify-center w-full"> 
        <button
          id="download-btn"
          onClick={handleDownloadPdf}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2 shadow-md"
        >
          <Download size={20} /> Download PDF (Siap Cetak)
        </button>
      </div>
    </div>
    
  );
};

export default LelayuPreview;