import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ setIsOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [studentName, setStudentName] = useState('Student'); 
  const [studentRole, setStudentRole] = useState('User');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const loadUserData = () => {
    const directName = sessionStorage.getItem('student_Name');
    const directRole = sessionStorage.getItem('student_Role');

    const storedUserInfo = sessionStorage.getItem('userInfo');
    const parsedUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;

    if (directName) {
      setStudentName(directName);
      setStudentRole(directRole || 'Student');
    } else if (parsedUser) {
      setStudentName(parsedUser.fullname || parsedUser.name || 'Student');
      setStudentRole(parsedUser.role || 'Student');
    }
  };

  useEffect(() => {
    loadUserData();

    window.addEventListener('profileUpdated', loadUserData);
    
    window.addEventListener('storage', loadUserData);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('profileUpdated', loadUserData);
      window.removeEventListener('storage', loadUserData);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 const avatarUrl = `https://ui-avatars.com/api/?name=${studentName}&background=6366f1&color=fff&bold=true`;

  const handleLogout = async () => {
    try {
      const storedInfo = sessionStorage.getItem("userInfo");
      const token = sessionStorage.getItem("token");
      
      if (storedInfo && token) {
        const userData = JSON.parse(storedInfo);
        await axios.post("/api/auth/logout", 
          { userId: userData.id || userData._id }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-20 shrink-0 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#020617] z-50 border-b border-white/5">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400">
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-indigo-500 text-xl font-black tracking-tight">
            Welcome back <span className="text-white font-bold">{studentName}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        

        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="flex items-center gap-3 bg-slate-900/50 p-1 lg:p-1.5 lg:pr-5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <img src={avatarUrl} className=" w-8 h-8 lg:w-10 lg:h-10 rounded-xl" alt="profile" />
            
            <div className="hidden md:block">
              <p className="text-xs font-black text-white uppercase tracking-widest leading-none">
                {studentName}
              </p>
              <p className="text-[10px] text-indigo-400 mt-1 font-bold uppercase">
                {studentRole}
              </p>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-colors" 
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/overview/studentdashboard/settings');
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

export default Header;
