// import React, { useState, useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   LayoutDashboard, GraduationCap, ClipboardList, CheckCircle, 
//   FileText, Megaphone, Bell, X, ChevronDown, Settings, LogOut, 
//   User, Zap, Menu, Users, UploadCloud, PlusCircle, BarChart3
// } from 'lucide-react';

// const FacultyDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
  
//   const sidebarRef = useRef(null);

//   // Entrance Animation
//   useEffect(() => {
//     const tl = gsap.timeline();
//     tl.fromTo(sidebarRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
//       .fromTo(".nav-item", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.4")
//       .fromTo(".main-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, "-=0.2");
//   }, []);

//   const navItems = [
//     { id: 'dashboard', label: 'Faculty Home', icon: <LayoutDashboard size={20}/> },
//     { id: 'classes', label: 'My Classes', icon: <Users size={20}/> },
//     { id: 'attendance', label: 'Attendance ', icon: <ClipboardList size={20}/> },
//     { id: 'materials', label: 'Upload Notes', icon: <UploadCloud size={20}/> },
//     { id: 'notice', label: 'Announcements', icon: <Megaphone size={20}/> },
//     { id: 'settings', label: 'Settings', icon: <Settings size={20}/> },
//   ];

//   return (
//     <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden relative font-sans">
      
//       {/* Background Gradients */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>

//       {/* SIDEBAR */}
//       <aside 
//         ref={sidebarRef} 
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         <div className="flex items-center justify-between mb-12 px-2">
//           <div className="flex items-center gap-3">
//             <div className="bg-gradient-to-br from-emerald-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-transform">
//               <GraduationCap size={26} className="text-white" />
//             </div>
//             <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Faculty<span className="text-emerald-500">Hub</span></h2>
//           </div>
//           <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
//         </div>

//         <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
//           {navItems.map((item) => (
//             <div 
//               key={item.id}
//               onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
//               className={`nav-item flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
//                 activeTab === item.id 
//                 ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
//                 : 'text-slate-400 hover:bg-white/5 hover:text-white'
//               }`}
//             >
//               {item.icon}
//               <span className="font-semibold tracking-wide">{item.label}</span>
//             </div>
//           ))}
//         </nav>
        
//         <div className="pt-6 border-t border-white/5">
//           <button className="flex items-center gap-3 px-5 py-3.5 w-full text-slate-500 hover:text-rose-400 transition-colors font-bold text-xs uppercase tracking-widest">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 h-screen overflow-y-auto relative z-10 scrollbar-hide">
//         <header className="h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-lg z-40 border-b border-white/5">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400"><Menu size={22} /></button>
//             <div>
//               <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold mb-1 ml-1 hidden sm:block">Faculty Management</p>
//               <h2 className="text-lg lg:text-2xl font-black capitalize text-white tracking-tight">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 lg:gap-6">
//             <div className="relative cursor-pointer p-3 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all">
//               <Bell size={20} className="text-slate-400" />
//               <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full"></span>
//             </div>

//             <div className="relative">
//               <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 bg-slate-900/50 p-1 lg:p-1.5 lg:pr-5 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer">
//                 <img src={`https://ui-avatars.com/api/?name=Krish&background=10b981&color=fff&bold=true`} className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl" alt="faculty profile" />
//                 <div className="hidden md:block text-left">
//                   <p className="text-xs font-black text-white leading-none tracking-widest uppercase font-sans">Prof. Krish</p>
//                   <p className="text-[10px] text-emerald-400 mt-1 font-bold uppercase">Senior Faculty</p>
//                 </div>
//                 <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="p-6 lg:p-10 space-y-10">
          
//           {activeTab === 'dashboard' && (
//             <>
//               {/* STATUS CARDS */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
//                 <div className="main-card bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
//                   <h3 className="text-white/70 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Today's Schedule</h3>
//                   <p className="text-5xl font-black text-white">04</p>
//                   <p className="text-emerald-100/60 text-xs mt-2 font-medium">Lectures across 3 Departments</p>
//                   <div className="absolute -bottom-6 -right-6 opacity-20"><Users size={120} /></div>
//                 </div>

//                 <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 relative">
//                   <h3 className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Pending Grading</h3>
//                   <p className="text-5xl font-black text-white">12</p>
//                   <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1"><Zap size={12}/> Needs review by Friday</p>
//                 </div>

//                 <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5">
//                   <h3 className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Assigned Students</h3>
//                   <p className="text-5xl font-black text-white">150</p>
//                   <div className="mt-4 flex -space-x-3">
//                     {[1,2,3,4].map(i => (
//                       <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-emerald-500 flex items-center justify-center text-[10px] font-bold">S{i}</div>
//                     ))}
//                     <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">+146</div>
//                   </div>
//                 </div>
//               </div>

//               {/* BOTTOM SECTION */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
//                 {/* RECENT SUBMISSIONS */}
//                 <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5">
//                   <div className="flex justify-between items-center mb-8">
//                     <h3 className="font-bold text-white text-lg flex items-center gap-2"><BarChart3 className="text-emerald-500" size={20}/> Recent Submissions</h3>
//                     <button className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:underline">View All</button>
//                   </div>
//                   <div className="space-y-4">
//                     {[
//                       { name: "Rahul S.", topic: "React Hooks Assignment", time: "2 mins ago" },
//                       { name: "Sneha P.", topic: "UI Design Case Study", time: "1 hour ago" },
//                       { name: "Aman K.", topic: "Tailwind CSS Project", time: "3 hours ago" }
//                     ].map((sub, i) => (
//                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-xs">{sub.name[0]}</div>
//                           <div>
//                             <p className="text-sm font-bold text-white">{sub.name}</p>
//                             <p className="text-[10px] text-slate-500">{sub.topic}</p>
//                           </div>
//                         </div>
//                         <span className="text-[10px] text-slate-600 font-bold uppercase">{sub.time}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* UPLOAD ZONE */}
//                 <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-center items-center border-dashed border-2 border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group">
//                   <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                     <UploadCloud size={32} className="text-emerald-500" />
//                   </div>
//                   <h3 className="font-bold text-white text-lg">Upload Study Material</h3>
//                   <p className="text-xs text-slate-500 mt-2">Drag and drop PDF, PPT or Video files</p>
//                   <button className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center gap-2">
//                     <PlusCircle size={14}/> Select Files
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// };

// export default FacultyDashboard;