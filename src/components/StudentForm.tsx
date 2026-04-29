import React, { useState, useEffect } from 'react';
import { Student, ACADEMIC_YEARS, CLASSES, Gender } from '../types';
import { Save, X, User, CreditCard, MapPin, Calendar, Briefcase, DollarSign, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentFormProps {
  onSave: (data: Omit<Student, 'id' | 'timestamp'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Student | null;
}

export default function StudentForm({ onSave, onCancel, initialData }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Student Data
  const [nama, setNama] = useState(initialData?.nama || '');
  const [nik, setNik] = useState(initialData?.nik || '');
  const [academicYear, setAcademicYear] = useState<Student['academicYear']>(initialData?.academicYear || '2627');
  const [selectedClass, setSelectedClass] = useState<Student['class']>(initialData?.class || '01');
  const [manualNis, setManualNis] = useState(initialData?.nis?.slice(-3) || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'Laki-laki');
  const [pob, setPob] = useState(initialData?.pob || '');
  const [dob, setDob] = useState(initialData?.dob || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Parent Data
  const [namaAyah, setNamaAyah] = useState(initialData?.parentData?.namaAyah || '');
  const [nikAyah, setNikAyah] = useState(initialData?.parentData?.nikAyah || '');
  const [pekerjaanAyah, setPekerjaanAyah] = useState(initialData?.parentData?.pekerjaanAyah || '');
  const [penghasilanAyah, setPenghasilanAyah] = useState(initialData?.parentData?.penghasilanAyah || '');
  
  const [namaIbu, setNamaIbu] = useState(initialData?.parentData?.namaIbu || '');
  const [nikIbu, setNikIbu] = useState(initialData?.parentData?.nikIbu || '');
  const [pekerjaanIbu, setPekerjaanIbu] = useState(initialData?.parentData?.pekerjaanIbu || '');
  const [penghasilanIbu, setPenghasilanIbu] = useState(initialData?.parentData?.penghasilanIbu || '');

  const nis = `${academicYear}${selectedClass}${manualNis.padStart(3, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data: Omit<Student, 'id' | 'timestamp'> = {
      nama,
      nik,
      nis,
      academicYear,
      class: selectedClass,
      gender,
      pob,
      dob,
      address,
      parentData: {
        namaAyah,
        nikAyah,
        pekerjaanAyah,
        penghasilanAyah,
        namaIbu,
        nikIbu,
        pekerjaanIbu,
        penghasilanIbu,
      },
    };

    await onSave(data);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto"
    >
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{initialData ? 'Perbarui Data Siswa' : 'Input Peserta Didik Baru'}</h2>
          <p className="text-slate-500 text-sm font-medium">Pastikan data yang diinput telah sesuai dengan berkas fisik</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {/* DATA SISWA */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">Informasi Personal Siswa</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nama Lengkap Sesuai Akte" placeholder="Contoh: Muhammad Rizky" required value={nama} onChange={(v) => setNama(v)} />
            <InputField label="Nomor Induk Kependudukan (NIK)" placeholder="16 Digit NIK" required value={nik} onChange={(v) => setNik(v)} />
            
            <div className="space-y-4 md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Generator NIS Akademik</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs font-mono font-bold text-indigo-600">ID: {nis}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField 
                  label="Tahun Ajaran" 
                  value={academicYear} 
                  onChange={(v) => setAcademicYear(v as any)}
                  options={ACADEMIC_YEARS.map(y => ({ label: `Periode ${y}`, value: y }))} 
                />
                <SelectField 
                  label="Penempatan Kelas" 
                  value={selectedClass} 
                  onChange={(v) => setSelectedClass(v as any)}
                  options={CLASSES.map(c => ({ label: `Kelas ${c}`, value: c }))} 
                />
                <InputField 
                  label="3 Digit Akhir" 
                  placeholder="001" 
                  maxLength={3} 
                  required 
                  value={manualNis} 
                  onChange={(v) => setManualNis(v.replace(/\D/g, ''))} 
                />
              </div>
            </div>

            <SelectField 
              label="Jenis Kelamin" 
              value={gender} 
              onChange={(v) => setGender(v as any)}
              options={[{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }]} 
            />
            <InputField label="Tempat Lahir" required value={pob} onChange={(v) => setPob(v)} />
            <InputField label="Tanggal Lahir" type="date" required value={dob} onChange={(v) => setDob(v)} />
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Alamat Tinggal Domisili</label>
              <textarea
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none min-h-[100px] text-sm font-medium"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* DATA ORANG TUA */}
        <section className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">Informasi Orang Tua / Wali</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* AYAH */}
            <div className="space-y-4">
              <div className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 inline-block mb-2">Profil Ayah Kandung</div>
              <InputField label="Nama Lengkap" value={namaAyah} onChange={setNamaAyah} />
              <InputField label="NIK Ayah" value={nikAyah} onChange={setNikAyah} />
              <InputField label="Profesi / Pekerjaan" value={pekerjaanAyah} onChange={setPekerjaanAyah} />
              <InputField label="Estimasi Penghasilan" value={penghasilanAyah} onChange={setPenghasilanAyah} />
            </div>

            {/* IBU */}
            <div className="space-y-4">
              <div className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 inline-block mb-2">Profil Ibu Kandung</div>
              <InputField label="Nama Lengkap" value={namaIbu} onChange={setNamaIbu} />
              <InputField label="NIK Ibu" value={nikIbu} onChange={setNikIbu} />
              <InputField label="Profesi / Pekerjaan" value={pekerjaanIbu} onChange={setPekerjaanIbu} />
              <InputField label="Estimasi Penghasilan" value={penghasilanIbu} onChange={setPenghasilanIbu} />
            </div>
          </div>
        </section>

        <div className="pt-10 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {initialData ? 'Simpan Perubahan' : 'Finalisasi Pendaftaran'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function InputField({ label, icon, value, onChange, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          className="w-full px-4 py-3.5 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-semibold text-slate-700 text-sm placeholder:text-slate-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <select
          className="w-full px-4 py-3.5 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-semibold text-slate-700 text-sm appearance-none cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}
