import { useState, useEffect } from 'react';
import { Home, Users, UserPlus, LogOut, LayoutDashboard, Database, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from './types';
import { gasService } from './services/gasService';
import Dashboard from './components/Dashboard';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import Login from './components/Login';

type View = 'dashboard' | 'students' | 'add';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await gasService.getStudents();
    setStudents(data);
    setLoading(false);
  };

  const handleSave = async (data: Omit<Student, 'id' | 'timestamp'>) => {
    const success = await gasService.saveStudent(data, editingStudent?.id);
    if (success) {
      await fetchData();
      setEditingStudent(null);
      setCurrentView('students');
    } else {
      alert('Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const success = await gasService.deleteStudent(id);
      if (success) {
        await fetchData();
      } else {
        alert('Gagal menghapus data.');
      }
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'students':
        return (
          <StudentTable 
            students={students} 
            onEdit={(s) => {
              setEditingStudent(s);
              setCurrentView('add');
            }} 
            onDelete={handleDelete} 
          />
        );
      case 'add':
        return (
          <StudentForm 
            onSave={handleSave} 
            onCancel={() => {
              setEditingStudent(null);
              setCurrentView('students');
            }}
            initialData={editingStudent}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">PPDB</h1>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-80">Versi Digital</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarLink 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} 
            />
            <SidebarLink 
              icon={<Users className="w-5 h-5" />} 
              label="Data Siswa" 
              active={currentView === 'students'} 
              onClick={() => { setCurrentView('students'); setSidebarOpen(false); }} 
            />
            <SidebarLink 
              icon={<UserPlus className="w-5 h-5" />} 
              label="Input Baru" 
              active={currentView === 'add'} 
              onClick={() => { setCurrentView('add'); setSidebarOpen(false); }} 
            />
          </nav>

          <div className="pt-8 border-t border-slate-100">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Keluar Sistem</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-8 h-20 bg-white border-b border-slate-200 flex items-center justify-between lg:justify-end sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">Operator Pusat</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Aktif</div>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
               OP
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
              </div>
            </div>
          ) : (
             <motion.div
               key={currentView}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
             >
               {renderView()}
             </motion.div>
          )}
        </div>

        <footer className="px-10 py-6 text-slate-400 text-xs font-medium border-t border-slate-100 flex justify-between items-center bg-white">
           <span>© 2026 PPDB Digital — Sistem Informasi Sekolah</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Server Terhubung</span>
        </footer>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative font-semibold
        ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
      `}
    >
      <div className={`transition-all ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
      <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-40 group-hover:translate-x-0'}`} />
    </button>
  );
}
