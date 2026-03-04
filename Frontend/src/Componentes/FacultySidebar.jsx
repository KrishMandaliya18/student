import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, UploadCloud, Megaphone, Settings, LogOut, GraduationCap, X } from 'lucide-react';

const FacultySidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    // { id: 'dashboard', label: 'Faculty Home', path: 'home', icon: <LayoutDashboard size={20}/> },
    { id: 'admin', label: 'AdminDashboard', path: 'admin', icon: <Users size={20}/> },
    { id: 'attendance', label: 'Attendance', path: 'attendance', icon: <ClipboardList size={20}/> },
    { id: 'materials', label: 'Upload Notes', path: 'materials', icon: <UploadCloud size={20}/> },
    { id: 'notice', label: 'Announcements', path: 'notice', icon: <Megaphone size={20}/> },
    { id: 'settings', label: 'Settings', path: 'settings', icon: <Settings size={20}/> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-indigo-600 p-2.5 rounded-2xl">
            <GraduationCap size={26} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-white italic">Admin<span className="text-emerald-500">Hub</span></h2>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink 
            key={item.id} 
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            {item.icon} <span className="font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default FacultySidebar;