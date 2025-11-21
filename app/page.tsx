'use client';

import { useState } from 'react';
import Head from 'next/head';
import LelayuPreview from './components/LelayuPreview'; 
import { Plus, Trash2, User, Clock, MapPin, HeartCrack, Send } from 'lucide-react'; 

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

const initialData: LelayuData = {
  namaAlmarhum: '',
  usia: '',
  padukuhan: '',
  hariMeninggal: '',
  tanggalMeninggal: '',
  jamMeninggal: '',
  hariPemakaman: '',
  tanggalPemakaman: '',
  jamPemakaman: '',
  makamLengkap: '',
  pihakBerduka: [{ nama: '', hubungan: '' }],
};

const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required = false }: any) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-gray-500 focus:ring-0 transition duration-150 ease-in-out text-gray-700
          ${type === 'number' ? 'input-no-spinners' : ''}
      `}
      required={required}
    />
    <style jsx global>{`
        /* Menghilangkan panah naik/turun di input number (hanya berlaku pada kolom Usia) */
        .input-no-spinners::-webkit-inner-spin-button, 
        .input-no-spinners::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
        .input-no-spinners {
            -moz-appearance: textfield; /* Firefox */
        }
    `}</style>
  </div>
);

const SectionHeader = ({ title, icon: Icon, colorClass }: { title: string, icon: React.ElementType, colorClass: string }) => (
    <div className={`flex items-center gap-3 pb-3 mb-4 border-b border-gray-300`}>
        <Icon size={20} className="text-gray-700" />
        <h2 className={`text-xl font-semibold text-gray-700`}>
            {title}
        </h2>
    </div>
);


export default function SubmitLelayuPage() {
  const [formData, setFormData] = useState<LelayuData>(initialData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<LelayuData | null>(null); 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddPihakBerduka = () => {
    setFormData((prev) => ({
      ...prev,
      pihakBerduka: [...prev.pihakBerduka, { nama: '', hubungan: '' }],
    }));
  };

  const handleRemovePihakBerduka = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pihakBerduka: prev.pihakBerduka.filter((_, i) => i !== index),
    }));
  };

  const handleChangePihakBerduka = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const list = [...formData.pihakBerduka];
    (list[index] as any)[name] = value;
    setFormData((prev) => ({ ...prev, pihakBerduka: list }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setSubmittedData(null);
    
    const validPihakBerduka = formData.pihakBerduka.filter(
        p => p.nama.trim() !== '' || p.hubungan.trim() !== ''
    );

    const dataToSend = {
      ...formData, 
      usia: Number(formData.usia),
      pihakBerduka: validPihakBerduka,
    };
    
    if (dataToSend.namaAlmarhum.trim() === '' || dataToSend.padukuhan.trim() === '') {
        setStatus('error');
        setMessage('Nama Almarhum dan Padukuhan wajib diisi.');
        return;
    }


    try {
      setStatus('success');
      setMessage(`Dokumen berhasil dibuat! Scroll ke bawah untuk melihat pratinjau dan men-download dalam bentuk PDF.`);
      
      setSubmittedData({ ...formData, usia: Number(formData.usia) });
      
      setFormData(initialData);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Terjadi kesalahan jaringan/pemrosesan data.');
    }
  };

  return (
    <div className="min-h-screen mx-auto bg-gray-50 flex flex-col items-center py-10 px-4">
      <Head>
        <title>Formulir Pawartos Lelayu</title>
      </Head>

      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-xl border border-gray-300 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Formulir Pembuatan Berita Duka
        </h1>
        <p className="text-gray-500 text-center mb-8 border-b pb-4">
          Masukkan detail untuk membuat dokumen berita duka
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <section className="space-y-5">
            <SectionHeader title="Data Almarhum" icon={User} colorClass="text-gray-700 border-gray-300" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nama Almarhum" name="namaAlmarhum" value={formData.namaAlmarhum} onChange={handleChange} placeholder="Contoh: Bpk. Sastro Wijoyo" required={true}/>
              <FormInput label="Usia (Tahun)" name="usia" type="number" value={formData.usia} onChange={handleChange} placeholder="Contoh: 75" />
              <div className="md:col-span-2">
                <FormInput label="Padukuhan/Alamat" name="padukuhan" value={formData.padukuhan} onChange={handleChange} placeholder="Contoh: Padukuhan Krandekan, Kalurahan Krembangan" required={true}/>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader title="Waktu Meninggal" icon={Clock} colorClass="text-gray-700 border-gray-300" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Hari (Jawa/Umum)" name="hariMeninggal" value={formData.hariMeninggal} onChange={handleChange} placeholder="Contoh: Rebo Pahing" />
              <FormInput label="Tanggal" name="tanggalMeninggal" type="date" value={formData.tanggalMeninggal} onChange={handleChange} />
              <FormInput label="Jam Meninggal (WIB)" name="jamMeninggal" value={formData.jamMeninggal} onChange={handleChange} placeholder="Contoh: 21.00" />
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader title="Waktu & Tempat Pemakaman" icon={MapPin} colorClass="text-gray-700 border-gray-300" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Hari Pemakaman" name="hariPemakaman" value={formData.hariPemakaman} onChange={handleChange} placeholder="Contoh: Kamis Legi" />
              <FormInput label="Tanggal Pemakaman" name="tanggalPemakaman" type="date" value={formData.tanggalPemakaman} onChange={handleChange} />
              <FormInput label="Jam Pemakaman" name="jamPemakaman" value={formData.jamPemakaman} onChange={handleChange} placeholder="Contoh: 10.00 WIB" />
            </div>
            <div className="pt-2">
              <FormInput label="Makam Lengkap" name="makamLengkap" value={formData.makamLengkap} onChange={handleChange} placeholder="Contoh: Makam Sasonoloyo, Kalurahan Krembangan" />
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader title="Pihak Berduka" icon={HeartCrack} colorClass="text-gray-700 border-gray-300" />
            <div className="space-y-4">
              {formData.pihakBerduka.map((p, index) => (
                <div key={index} className="flex gap-4 items-center p-3 rounded-lg border border-gray-300 bg-gray-50">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Nama Pihak Berduka"
                      name="nama"
                      value={p.nama}
                      onChange={(e: any) => handleChangePihakBerduka(index, e)}
                      placeholder="Contoh: Bpk. Bambang Sutikno"
                    />
                    <FormInput
                      label="Hubungan"
                      name="hubungan"
                      value={p.hubungan}
                      onChange={(e: any) => handleChangePihakBerduka(index, e)}
                      placeholder="Contoh: Putra Almarhum"
                    />
                  </div>
                  {formData.pihakBerduka.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePihakBerduka(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg transition duration-150 ease-in-out"
                      aria-label="Hapus Pihak Berduka"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddPihakBerduka}
              className="mt-4 flex items-center gap-2 border border-gray-600 text-gray-600 font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-gray-100"
            >
              <Plus size={18} /> Tambah Baris Duka
            </button>
          </section>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-3 px-6 rounded-lg text-lg font-bold text-white transition duration-300 ease-in-out flex items-center justify-center gap-2
              ${status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900'
              }`}
          >
            {status === 'loading' ? (
                <>
                    <Clock size={20} className="animate-spin" /> 
                    Memproses Data...
                </>
            ) : (
                <>
                    <Send size={20} /> 
                    Buat Preview Pawartos
                </>
            )}
          </button>

          {message && (
            <div
              className={`p-4 rounded-lg font-medium text-sm border flex items-center gap-2
                ${status === 'success' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'
              }`}
            >
              {status === 'success' ? '✅' : '❌'} {message}
            </div>
          )}
        </form>
      </div>
      
      {submittedData && (
        <LelayuPreview data={submittedData} />
      )}
      
    </div>
  );
}