import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Zap, ClipboardList, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  // Entrance Animation for cards
  useEffect(() => {
    gsap.fromTo(".main-card", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="space-y-8 lg:space-y-10">
      
      {/* Top Section: Scorecard & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PERFORMANCE CARD */}
        <div className="main-card lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group border border-white/10">
          <div className="relative z-10">
            <h3 className="text-white/70 font-bold tracking-widest uppercase text-[10px] mb-4">Academic Scorecard</h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 text-center sm:text-left">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-[8px] lg:border-[10px] border-white/10 border-t-white flex items-center justify-center relative shadow-inner">
                <span className="text-xl lg:text-2xl font-black text-white">92%</span>
              </div>
              <div>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-4xl lg:text-6xl font-black text-white tracking-tighter">8.54</span>
                  <span className="text-indigo-200 font-bold text-lg lg:text-xl tracking-widest">CGPA</span>
                </div>
                <p className="text-indigo-100/60 text-xs lg:text-sm mt-2 font-medium italic">Term 6 • Computer Science</p>
              </div>
            </div>
          </div>
          {/* Background Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-48 h-48 lg:w-64 lg:h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        </div>

        {/* ATTENDANCE CARD */}
        <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-white mb-6 tracking-wide">Attendance</h3>
          <div className="relative w-28 h-28 lg:w-32 lg:h-32 bg-slate-800 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-2xl ring-4 ring-indigo-500/10">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-xl lg:text-2xl font-black text-white">75%</span>
            </div>
            {/* Wave Animation Effect */}
            <motion.div initial={{ top: '100%' }} animate={{ top: '25%' }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute inset-0 bg-indigo-500/50" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] left-[-50%] w-[200%] h-[200%] bg-indigo-600 rounded-[40%]" />
          </div>
          <p className="text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest">Ongoing Semester</p>
        </div>
      </div>

      {/* Bottom Section: Activity Heatmap */}
      <div className="grid grid-cols-1 gap-8">
        <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Zap size={20} className="text-yellow-500" />
            <h3 className="font-bold text-white text-lg">Activity Heatmap</h3>
          </div>
          
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-30 gap-2">
            {[...Array(30)].map((_, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.2, backgroundColor: '#6366f1' }}
                className={`h-6 rounded-md transition-colors ${
                  i % 7 === 0 ? 'bg-indigo-400' : i % 3 === 0 ? 'bg-indigo-900' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
            <span>Low Activity</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-900 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
            </div>
            <span>High Activity</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;