import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FacultyHeader = ({ setIsOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // const [userData, setUserData] = useState({ name: 'Guest', role: 'User' });
  const [adminName, setAdminName] = useState('admin');
  const [adminRole, setAdminRole] = useState('admin');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // --- useEffect ke andar ka logic update karein ---
useEffect(() => {
  // Data load karne ka function
  const loadUserData = () => {
    const storedData = sessionStorage.getItem('userInfo');
    if (storedData) {
      const userInfo = JSON.parse(storedData);
      setAdminName(userInfo.name || 'Admin');
      setAdminRole(userInfo.role || 'Admin');
    }
  };

  // 1. Pehli baar load karein
  loadUserData();

  // 2. Custom event listen karein (jab profile update ho)
  window.addEventListener('profileUpdated', loadUserData);

  // Dropdown close logic
  const handleTabClose = () => {
         // Aapke backend ka URL
         const url = "http://localhost:5000/api/auth/logout-on-close"; 
         
         // User ki pehchan ke liye email ya ID bhejein
         const data = JSON.stringify({ email: user.email }); 
         
         // Beacon API ensure karta hai ki request successfully chali jaye
         const blob = new Blob([data], { type: 'application/json' });
         navigator.sendBeacon(url, blob);
     };
 
     window.addEventListener("beforeunload", handleTabClose);
 
     return () => {
         window.removeEventListener("beforeunload", handleTabClose);
     };
 }, []);
// useEffect(() => {
//   // 1. Storage se 'userInfo' nikalna (Kyunki ab hum isi key mein save kar rahe hain)
//   const storedData = sessionStorage.getItem('userInfo');

//   if (storedData) {
//     const userInfo = JSON.parse(storedData);
    
//     // State update karein
//     setAdminName(userInfo.name || 'Admin');
//     setAdminRole(userInfo.role || 'Admin');
//   }

//   // Dropdown close logic (wahi rahega)
//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setShowProfileMenu(false);
//     }
//   };
//   document.addEventListener('mousedown', handleClickOutside);
//   return () => document.removeEventListener('mousedown', handleClickOutside);
// }, []);
  // useEffect(() => {
  //   // 1. LocalStorage se name aur role nikalna
    
  //   // Dono keys ko check karo
  //   const aName = sessionStorage.getItem('admin_Name');
  //   const aRole = sessionStorage.getItem('admin_Role');

  //   if (aName) {
  //       setAdminName(aName);
  //       setAdminRole(aRole || 'Admin');
  //   }


  //   // 2. Agar data exist karta hai toh state update karein
  //   // if (storedName) {
  //   //   setUserData({
  //   //     name: storedName,
  //   //     role: storedRole || 'User'
  //   //   });
  //   // }

  //   // Dropdown close logic
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setShowProfileMenu(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  // Initials ke liye Avatar URL (UI Avatars service)
  const avatarUrl = `https://ui-avatars.com/api/?name=${adminName}&background=10b981&color=fff&bold=true`;

  const handleLogout = async () => {
    try {
        // Correct key: "userInfo" dhoondein
        const storedInfo = sessionStorage.getItem("userInfo");
        if (!storedInfo) {
            window.location.href = "/login";
            return;
        }

        const userData = JSON.parse(storedInfo);
        const token = sessionStorage.getItem("token");

        // Backend call: userId bhejna zaroori hai status false karne ke liye
        // backend controller mein user._id ko humne 'id' key mein bheja hai
        await axios.post("http://localhost:3000/api/auth/logout", 
            { userId: userData.id }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Frontend clear
        sessionStorage.clear();
        window.location.href = "/login";
    } catch (error) {
        console.error("Logout failed", error);
        sessionStorage.clear();
        window.location.href = "/login";
    }
};
// const handleLogout = async () => {
//     try {
//         // Correct key: "userInfo" dhoondein
//         const storedInfo = sessionStorage.getItem("userInfo");
//         if (!storedInfo) {
//             window.location.href = "/login";
//             return;
//         }

//         const userData = JSON.parse(storedInfo);
//         const token = sessionStorage.getItem("token");

//         // Backend call: userId bhejna zaroori hai status false karne ke liye
//         // backend controller mein user._id ko humne 'id' key mein bheja hai
//         await axios.post("http://localhost:3000/api/auth/logout", 
//             { userId: userData.id }, 
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Frontend clear
//         sessionStorage.clear();
//         window.location.href = "/login";
//     } catch (error) {
//         console.error("Logout failed", error);
//         sessionStorage.clear();
//         window.location.href = "/login";
//     }
// };
  // const handleLogout = async () => {
  //   sessionStorage.clear();
  //   try {
  //     await axios.post('http://localhost:3000/api/auth/logout');
  //   } catch (error) {
  //     console.error("Logout error", error);
  //   } finally {
  //     sessionStorage.clear();
  //     navigate('/login');
  //   }
  // };

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
        {/* Notification Bell */}
        {/* <div className="relative cursor-pointer p-3 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all group">
          <Bell size={20} className="text-slate-400 group-hover:text-emerald-400" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
        </div> */}

        {/* Profile Dropdown */}
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

export default FacultyHeader;