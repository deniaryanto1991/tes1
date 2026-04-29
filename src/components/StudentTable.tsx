import { useState } from 'react';
import { Student, ACADEMIC_YEARS } from '../types';
import { Search, Download, Edit2, Trash2, Filter, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate, formatCurrency } from '../lib/utils';
import * as XLSX from 'xlsx';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.nik.includes(searchTerm) || 
                         s.nis.includes(searchTerm);
    const matchesYear = yearFilter === '' || s.academicYear === yearFilter;
    return matchesSearch && matchesYear;
  });

  const exportToExcel = () => {
    const dataToExport = filteredStudents.map(s => ({
      'Timestamp': formatDate(s.timestamp),
      'Nama': s.nama,
      'NIK': s.nik,
      'NIS': s.nis,
      'Tahun Ajaran': s.academicYear,
      'Kelas': s.class,
      'Jenis Kelamin': s.gender,
      'Tempat Lahir': s.pob,
      'Tanggal Lahir': formatDate(s.dob),
      'Alamat': s.address,
      'Nama Ayah': s.parentData.namaAyah,
      'Nama Ibu': s.parentData.namaIbu,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    XLSX.writeFile(wb, `Data_Siswa_PPDB_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
      <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Data Siswa Terdaftar</h3>
          <p className="text-slate-500 text-sm font-medium">Monitoring pendaftaran real-time</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari NIS atau Nama..."
              className="pl-11 pr-4 py-3 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="pl-11 pr-8 py-3 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">Semua Tahun</option>
              {ACADEMIC_YEARS.map(y => (
                <option key={y} value={y}>TA {y}</option>
              ))}
            </select>
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-slate-200 rounded-full text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Unduh Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">Peserta Didik</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">Data Akademik</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">Lokasi & TTL</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 text-right">Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={student.id} 
                  className="group hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg ${
                        student.gender === 'Laki-laki' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {student.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{student.nama}</div>
                        <div className="text-xs font-mono font-medium text-slate-400 mt-0.5 tracking-tighter">NIK: {student.nik}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded uppercase tracking-wider">TA {student.academicYear}</span>
                        <span className="text-xs font-bold text-slate-600">Kelas {student.class}</span>
                      </div>
                      <div className="text-sm font-mono font-black text-indigo-600">{student.nis}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px]" title={student.address}>
                        {student.address}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {student.pob}, {formatDate(student.dob)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(student)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDelete(student.id)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-400 rounded-lg font-bold hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="group-hover:hidden text-slate-300">
                      <MoreHorizontal className="w-5 h-5 ml-auto" />
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                  Data siswa tidak ditemukan...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
        <span>Menampilkan {filteredStudents.length} siswa</span>
        <div className="flex items-center gap-2">
           <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center opacity-50 cursor-not-allowed text-slate-400">←</button>
           <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">1</button>
           <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">→</button>
        </div>
      </div>
    </div>
  );
}
