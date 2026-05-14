import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = ({ setIsOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [adminName, setAdminName] = useState('admin');
  const [adminRole, setAdminRole] = useState('admin');
  const navigate = useNavigate();
  const menuRef = useRef(null);

useEffect(() => {
  const loadUserData = () => {
    const storedData = sessionStorage.getItem('userInfo');
    if (storedData) {
      const userInfo = JSON.parse(storedData);
      setAdminName(userInfo.name || 'Admin');
      setAdminRole(userInfo.role || 'Admin');
    }
  };

  loadUserData();

  window.addEventListener('profileUpdated', loadUserData);

  const handleTabClose = () => {
         const url = "http://localhost:5000/api/auth/logout-on-close"; 
         
         const data = JSON.stringify({ email: user.email }); 
         
         const blob = new Blob([data], { type: 'application/json' });
         navigator.sendBeacon(url, blob);
     };
 
     window.addEventListener("beforeunload", handleTabClose);
 
     return () => {
         window.removeEventListener("beforeunload", handleTabClose);
     };
 }, []);

  const avatarUrl = `https://ui-avatars.com/api/?name=${adminName}&background=10b981&color=fff&bold=true`;

  const handleLogout = async () => {
     try {
         const storedInfo = sessionStorage.getItem("userInfo");
         if (!storedInfo) {
             window.location.href = "/login";
             return;
         }
 
         const userData = JSON.parse(storedInfo);
         const token = sessionStorage.getItem("token");
 
     
         await axios.post("/api/auth/logout", 
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
 

  return (
    <header className="h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-lg z-40 border-b border-white/5">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400">
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-emerald-500 text-xl font-black tracking-tight">
            Welcome back <span className="text-white font-bold">{adminName}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
       

        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="flex items-center gap-3 bg-slate-900/50 p-1 lg:p-1.5 lg:pr-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <img src={avatarUrl} className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl" alt="profile" />
            
            <div className="hidden md:block">
              <p className="text-xs font-black text-white uppercase tracking-widest leading-none">
                {adminName}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold uppercase">
                {adminRole}
              </p>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-colors" 
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/overview/admindashboard/settings');
                }}
              >
                <User size={16} /> My Profile
              </button>
              
              <div className="h-px bg-white/5 my-2"></div>
              
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
