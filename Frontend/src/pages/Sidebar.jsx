import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import gsap from 'gsap';
import axios from 'axios';
import { 
  LayoutDashboard, ClipboardList, CheckCircle, 
  FileText, Megaphone, Settings, 
  LogOut, GraduationCap, X 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    gsap.fromTo(sidebarRef.current, 
      { x: -100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

 const handleLogout = async () => {
    try {
        const storedInfo = sessionStorage.getItem("userInfo");
        if (!storedInfo) {
            window.location.href = "/login";
            return;
        }

        const userData = JSON.parse(storedInfo);
        const token = sessionStorage.getItem("token");

      
        await axios.post("http://localhost:3000/api/auth/logout", 
            { userId: userData.id }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        sessionStorage.clear();
        window.location.href = "/login";
    } catch (error) {
        console.error("Logout failed", error);
        sessionStorage.clear();
        window.location.href = "/login";
    }
};
  const navItems = [
    { path: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { path: 'assignments', label: 'Assignments', icon: <ClipboardList size={20}/> },
    { path: 'attendance', label: 'Attendance', icon: <CheckCircle size={20}/> },
    { path: 'exams', label: 'Exams', icon: <FileText size={20}/> },
    { path: 'notice', label: 'Notice Board', icon: <Megaphone size={20}/> },
    { path: 'settings', label: 'Settings', icon: <Settings size={20}/> },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside 
        ref={sidebarRef} 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-12 px-2 group">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <GraduationCap size={26} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
              Smart<span className="text-indigo-500">Campus</span>
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="font-semibold tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3.5 w-full text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;