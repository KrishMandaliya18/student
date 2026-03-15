import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ setIsOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [studentName, setStudentName] = useState('Student'); // Default value
  const [studentRole, setStudentRole] = useState('User');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // --- 1. loadUserData Function Define Kiya ---
  const loadUserData = () => {
    // Pehle direct keys check karein
    const directName = sessionStorage.getItem('student_Name');
    const directRole = sessionStorage.getItem('student_Role');

    // Agar object format mein hai (userInfo)
    const storedUserInfo = sessionStorage.getItem('userInfo');
    const parsedUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;

    if (directName) {
      setStudentName(directName);
      setStudentRole(directRole || 'Student');
    } else if (parsedUser) {
      // Yahan check karein ki aapka backend 'name' bhej raha hai ya 'fullname'
      setStudentName(parsedUser.fullname || parsedUser.name || 'Student');
      setStudentRole(parsedUser.role || 'Student');
    }
  };

  useEffect(() => {
    // Initial load par data fetch karein
    loadUserData();

    // Jab settings page se profile update ho, tab ye event trigger hoga
    window.addEventListener('profileUpdated', loadUserData);
    
    // Storage event listener (agar dusre tab mein update ho)
    window.addEventListener('storage', loadUserData);

    // Dropdown close logic
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
        await axios.post("http://localhost:3000/api/auth/logout", 
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
        {/* <div className="relative cursor-pointer p-3 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group">
          <Bell size={20} className="text-slate-400 group-hover:text-indigo-400" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
        </div> */}

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

// import React, { useState, useRef } from 'react';
// import { Bell, ChevronDown, Menu, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useLocation } from 'react-router-dom';
// import gsap from 'gsap';
// import axios from 'axios'; // Axios import karein

// const Header = ({ setIsOpen }) => {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const bellRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const pageName = location.pathname.split('/')[1] || 'Dashboard';

//   // --- Logout Logic ---
//   const handleLogout = async () => {
//     try {
//       // Backend API call (Optional if using only JWT in LocalStorage)
//       await axios.post('http://localhost:5000/api/auth/logout'); 
      
//       // Clear Frontend Data
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
      
//       // Redirect to Login Page
//       navigate('/login');
//     } catch (error) {
//       console.error("Logout failed", error);
//       // Fail hone par bhi storage clear karke bhej sakte hain
//       localStorage.clear();
//       navigate('/login');
//     }
//   };

//   const shakeBell = () => {
//     gsap.to(bellRef.current, { rotation: 15, duration: 0.1, yoyo: true, repeat: 5 });
//   };

//   return (
//     <header className="h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-lg z-40 border-b border-white/5 shrink-0">
//       <div className="flex items-center gap-4">
//         <button onClick={() => setIsOpen(true)} className="lg:hidden p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-400">
//           <Menu size={22} />
//         </button>
//         <div>
//           <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-1 ml-1 hidden sm:block">Overview</p>
//           <h2 className="text-xl lg:text-2xl font-black capitalize text-white tracking-tight">{pageName}</h2>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 lg:gap-6">
//         {/* Notifications code... */}
        
//         {/* Profile */}
//         <div className="relative">
//           <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 bg-slate-900/50 p-1 lg:pr-5 rounded-2xl border border-white/5 cursor-pointer">
//             <img src="https://ui-avatars.com/api/?name=Krish&background=4f46e5&color=fff" className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl" alt="profile" />
//             <ChevronDown size={14} className={`text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
//           </div>
          
//           <AnimatePresence>
//             {showProfileMenu && (
//               <motion.div 
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 10 }}
//                 className="absolute right-0 mt-4 w-48 bg-[#0f172a] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden"
//               >
//                 <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
//                   <User size={16}/> Profile
//                 </button>
//                 {/* <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
//                   <SettingsIcon size={16}/> Settings
//                 </button> */}
//                 <div className="h-px bg-white/5 my-2"></div>
                
//                 {/* Logout Button updated */}
//                 <button 
//                   onClick={handleLogout} 
//                   className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold transition-colors"
//                 >
//                   <LogOut size={16}/> Logout
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;