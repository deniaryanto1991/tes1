import { useState, useEffect } from 'react';
import { Student, ACADEMIC_YEARS } from '../types';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  students: Student[];
}

export default function Dashboard({ students }: DashboardProps) {
  const [selectedYear, setSelectedYear] = useState<string>(ACADEMIC_YEARS[0]);
  
  const filteredStudents = students.filter(s => s.academicYear === selectedYear);
  
  const stats = {
    total: filteredStudents.length,
    male: filteredStudents.filter(s => s.gender === 'Laki-laki').length,
    female: filteredStudents.filter(s => s.gender === 'Perempuan').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 font-medium">Statistik pendaftaran tahun ajaran {selectedYear}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {ACADEMIC_YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedYear === year 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              TA {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6" />}
          label="Total Terdaftar"
          value={stats.total}
          color="bg-slate-50 text-slate-600"
          valueColor="text-slate-900"
          delay={0}
        />
        <StatCard 
          icon={<UserCheck className="w-6 h-6" />}
          label="Siswa Laki-laki"
          value={stats.male}
          color="bg-indigo-50 text-indigo-600"
          valueColor="text-indigo-600"
          delay={0.1}
          showProgress
          progressColor="bg-indigo-600"
          percentage={(stats.male / (stats.total || 1)) * 100}
        />
        <StatCard 
          icon={<UserPlus className="w-6 h-6" />}
          label="Siswa Perempuan"
          value={stats.female}
          color="bg-rose-50 text-rose-600"
          valueColor="text-rose-500"
          delay={0.2}
          showProgress
          progressColor="bg-rose-500"
          percentage={(stats.female / (stats.total || 1)) * 100}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden relative group"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Pusat Informasi</div>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Selamat Datang di Sistem PPDB Digital</h4>
          <p className="text-slate-500 leading-relaxed max-w-2xl font-medium">
            Sistem manajemen pendaftaran siswa baru yang efisien dan terstruktur. Gunakan dashboard ini untuk 
            memantau statistik real-time dan mengelola data pendaftar dengan standar minimalis yang bersih.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors duration-500" />
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, color, delay, valueColor, showProgress, progressColor, percentage }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between"
    >
      <div>
        <p className="text-slate-500 text-sm font-semibold mb-1">{label}</p>
        <h3 className={`text-4xl font-black ${valueColor} tracking-tighter`}>{value.toLocaleString()}</h3>
      </div>
      
      {showProgress ? (
        <div className="mt-6">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Distribusi</span>
            <span>{Math.round(percentage || 0)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${progressColor}`} 
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <span className="text-xs font-bold text-green-600">Updated baru saja</span>
        </div>
      )}
    </motion.div>
  );
}
