import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Zap, Clock, BookOpen, Bell, ArrowRight, CheckCircle, Download } from 'lucide-react';

const Dashboard = () => {
  useEffect(() => {
    gsap.fromTo(".main-card", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="space-y-8 lg:space-y-10 p-2">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="main-card lg:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group border border-white/10">
          <div className="relative z-10">
            <h3 className="text-white/70 font-black tracking-widest uppercase text-[10px] mb-4 flex items-center gap-2">
              <Zap size={14} className="fill-white" /> Academic Excellence
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-[8px] border-white/10 border-t-white flex items-center justify-center relative shadow-inner">
                <span className="text-xl lg:text-2xl font-black text-white">92%</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl lg:text-7xl font-black text-white tracking-tighter">8.54</span>
                  <span className="text-emerald-100 font-bold text-lg lg:text-xl tracking-widest">CGPA</span>
                </div>
                <p className="text-emerald-100/60 text-xs lg:text-sm mt-2 font-black uppercase tracking-widest">Term 6 • Computer Science</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        </div>

        <div className="main-card bg-[#0a0f1c] p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center shadow-2xl">
          <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-[0.3em] mb-6">Live Attendance</h3>
          <div className="relative w-28 h-28 lg:w-32 lg:h-32 bg-slate-900 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl ring-8 ring-emerald-500/5">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-xl lg:text-2xl font-black text-white">75%</span>
            </div>
            <motion.div initial={{ top: '100%' }} animate={{ top: '25%' }} transition={{ duration: 2 }} className="absolute inset-0 bg-emerald-500/30" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] left-[-50%] w-[200%] h-[200%] bg-emerald-600 rounded-[40%]" />
          </div>
          <p className="text-[10px] text-emerald-500 mt-6 font-black uppercase tracking-widest">On Track</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="main-card bg-[#0a0f1c] p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-white uppercase text-xs tracking-widest flex items-center gap-2">
               <Clock className="text-emerald-500" size={16} /> Today's Schedule
             </h3>
             <span className="text-[10px] text-slate-500 font-bold">14 March, 2026</span>
          </div>
          
          <div className="space-y-4">
             {[
               { time: "09:00 AM", subject: "Software Engineering", room: "Lab 204", color: "bg-blue-500" },
               { time: "11:30 AM", subject: "React Frameworks", room: "LH-01", color: "bg-emerald-500" },
               { time: "02:00 PM", subject: "Database Systems", room: "LH-05", color: "bg-amber-500" },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                  <div className={`w-1 h-10 ${item.color} rounded-full`}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{item.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-300">{item.time}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="main-card bg-[#0a0f1c] p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="font-black text-white uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={16} /> Pending Tasks
          </h3>
          <div className="space-y-4">
             {[
               { task: "Submit SE Project", due: "2 days left", priority: "High" },
               { task: "React UI Fixes", due: "5 days left", priority: "Medium" },
             ].map((item, i) => (
               <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.task}</h4>
                    <p className="text-[10px] text-rose-500 font-black uppercase mt-1">{item.due}</p>
                  </div>
                  <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                    <ArrowRight size={16} />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="main-card bg-[#0a0f1c] p-6 rounded-[2rem] border border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { name: "ID Card", icon: <Download size={18} /> },
             { name: "Syllabus", icon: <BookOpen size={18} /> },
             { name: "Leave", icon: <Bell size={18} /> },
             { name: "Results", icon: <CheckCircle size={18} /> },
           ].map((action, i) => (
             <button key={i} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                <span className="text-slate-500 group-hover:text-emerald-500">{action.icon}</span>
                <span className="text-xs font-black text-slate-400 group-hover:text-white uppercase">{action.name}</span>
             </button>
           ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
