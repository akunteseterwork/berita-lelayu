"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Plus,
  Trash2,
  User,
  Clock,
  MapPin,
  HeartCrack,
  Send,
  Instagram,
  X
} from 'lucide-react';
import LelayuPreview from './components/LelayuPreview';

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
  <div className="flex flex-col space-y-1 group">
    <label htmlFor={name} className="text-sm font-semibold text-gray-600 group-focus-within:text-black transition-colors duration-200">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none transition-all duration-200 text-gray-700
          focus:bg-white focus:border-gray-900 focus:ring-4 focus:ring-gray-100
          ${type === 'number' ? 'input-no-spinners' : ''}
      `}
      required={required}
    />
  </div>
);

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 pb-3 mb-6 border-b border-gray-100">
    <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
      <Icon size={18} />
    </div>
    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
      {title}
    </h2>
  </div>
);

export default function SubmitLelayuPage() {
  const [formData, setFormData] = useState<LelayuData>(initialData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<LelayuData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

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

  const handleChangePihakBerduka = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = [...formData.pihakBerduka];
    (list[index] as any)[name] = value;
    setFormData((prev) => ({ ...prev, pihakBerduka: list }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    setTimeout(() => {
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
        setMessage('Nama Alm./Almh dan Padukuhan wajib diisi.');
        return;
      }

      setStatus('success');
      setMessage(`Dokumen berhasil dibuat! Pratinjau muncul otomatis.`);
      setSubmittedData({ ...formData, usia: Number(formData.usia) });
      setIsModalOpen(true);
      setFormData(initialData);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-12 px-4 selection:bg-gray-900 selection:text-white font-sans">
      <Head>
        <title>Formulir Pawartos Lelayu</title>
      </Head>

      <style jsx global>{`
        .input-no-spinners::-webkit-inner-spin-button, 
        .input-no-spinners::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
        .input-no-spinners {
            -moz-appearance: textfield;
        }
      `}</style>

      <div className="w-full max-w-4xl bg-white p-8 md:p-14 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tighter uppercase">
            PAWARTOS LELAYU
          </h1>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Masukkan detail untuk membuat dokumen berita lelayu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section>
            <SectionHeader title="Data Almarhum / Almarhumah" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nama Alm./Almh." name="namaAlmarhum" value={formData.namaAlmarhum} onChange={handleChange} placeholder="Contoh: Bpk. Sastro Wijoyo" required={true} />
              <FormInput label="Usia (Tahun)" name="usia" type="number" value={formData.usia} onChange={handleChange} placeholder="Contoh: 75" />
              <div className="md:col-span-2">
                <FormInput label="Padukuhan/Alamat" name="padukuhan" value={formData.padukuhan} onChange={handleChange} placeholder="Contoh: Padukuhan Krandekan, Kalurahan Krembangan" required={true} />
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Waktu Meninggal" icon={Clock} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Hari (Jawa/Umum)" name="hariMeninggal" value={formData.hariMeninggal} onChange={handleChange} placeholder="Contoh: Rebo Pahing" />
              <FormInput label="Tanggal" name="tanggalMeninggal" type="date" value={formData.tanggalMeninggal} onChange={handleChange} />
              <FormInput label="Jam Meninggal (WIB)" name="jamMeninggal" value={formData.jamMeninggal} onChange={handleChange} placeholder="Contoh: 21:00 (tanpa WIB)" />
            </div>
          </section>

          <section>
            <SectionHeader title="Waktu & Tempat Pemakaman" icon={MapPin} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Hari Pemakaman" name="hariPemakaman" value={formData.hariPemakaman} onChange={handleChange} placeholder="Contoh: Kamis Legi" />
              <FormInput label="Tanggal Pemakaman" name="tanggalPemakaman" type="date" value={formData.tanggalPemakaman} onChange={handleChange} />
              <FormInput label="Jam Pemakaman (WIB)" name="jamPemakaman" value={formData.jamPemakaman} onChange={handleChange} placeholder="Contoh: 14:00 (tanpa WIB)" />
            </div>
            <div className="mt-6">
              <FormInput label="Makam Lengkap" name="makamLengkap" value={formData.makamLengkap} onChange={handleChange} placeholder="Contoh: Makam Sasonoloyo, Kalurahan Krembangan" />
            </div>
          </section>

          <section>
            <SectionHeader title="Pihak Berduka" icon={HeartCrack} />
            <div className="space-y-4">
              {formData.pihakBerduka.map((p, index) => (
                <div key={index} className="flex gap-4 items-end p-5 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Nama Pihak Berduka" name="nama" value={p.nama} onChange={(e: any) => handleChangePihakBerduka(index, e)} placeholder="Contoh: Bpk. Bambang Sutikno" />
                    <FormInput label="Hubungan" name="hubungan" value={p.hubungan} onChange={(e: any) => handleChangePihakBerduka(index, e)} placeholder="Contoh: Putra Almarhum" />
                  </div>
                  {formData.pihakBerduka.length > 1 && (
                    <button type="button" onClick={() => handleRemovePihakBerduka(index)} className="mb-1 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddPihakBerduka} className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors duration-200">
              <Plus size={16} /> Tambah Baris Duka
            </button>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 flex items-center justify-center gap-3
                ${status === 'loading' ? 'bg-gray-300 cursor-not-allowed scale-[0.98]' : 'bg-gray-900 hover:bg-black hover:shadow-xl active:scale-[0.99]'}
              `}
            >
              {status === 'loading' ? 'Sedang Memproses...' : <><Send size={18} /> Buat Berita</>}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium border text-center animate-pulse ${status === 'success' ? 'bg-gray-900 text-white border-gray-900' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {status === 'success' ? '✅' : '❌'} {message}
            </div>
          )}
        </form>
      </div>

      {isModalOpen && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />

          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                Pratinjau Berita Lelayu
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 md:p-10 flex flex-col items-center">
              <LelayuPreview data={submittedData} />
            </div>
          </div>
        </div>
      )}

      <footer className="mt-15 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <a
          href="https://instagram.com/hilalmustofa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-bold text-black hover:text-pink-600 transition-colors duration-200"
        >
          <span className="text-[10px] text-black">Form by</span> <Instagram size={12} /> @HILALMUSTOFA
        </a>
      </footer>
    </div>
  );
}