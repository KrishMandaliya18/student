import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CalendarDays, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Search,
  Zap
} from 'lucide-react';

const Assignments = () => {
  // Demo Data (Backend se connect kar lena)
  const feedItems = [
    {
      id: 1,
      type: 'assignment',
      title: "React + GSAP Architecture",
      tag: "Frontend",
      due: "15 March",
      status: "pending",
      priority: "high",
      description: "Complete the landing page animation using GSAP ScrollTrigger."
    },
    {
      id: 2,
      type: 'timetable',
      title: "Updated Semester Schedule",
      tag: "Exam Cell",
      due: "14 March",
      status: "new",
      priority: "medium",
      attachment: "timetable_v2.pdf"
    },
    {
      id: 3,
      type: 'assignment',
      title: "Database Schema Design",
      tag: "Backend",
      due: "10 March",
      status: "completed",
      priority: "normal",
    }
  ];

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'high': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-10 text-slate-200">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              <Zap className="text-emerald-500 fill-emerald-500" /> Task <span className="text-emerald-500 underline underline-offset-8">Center</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Smart Campus Assignment Feed v2.0</p>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4">
             <div className="bg-[#0a0f1c] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-black text-xl">
                  {feedItems.filter(i => i.status !== 'completed').length}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase">Pending</p>
                   <p className="text-xs font-bold text-white">Assignments</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- Search & Filter Row --- */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, tags or dead-lines..." 
            className="w-full bg-[#0a0f1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/40 transition-all shadow-2xl"
          />
        </div>

        {/* --- List Container --- */}
        <div className="grid gap-5">
          <AnimatePresence>
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className={`relative overflow-hidden bg-[#0a0f1c] border p-6 rounded-[2rem] transition-all duration-500 ${
                  item.status === 'completed' 
                  ? 'border-emerald-500/10 opacity-60 grayscale-[0.5]' 
                  : 'border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]'
                }`}>
                  
                  {/* Decorative Glow */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-all" />

                  <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    {/* Left: Icon & Date */}
                    <div className="flex md:flex-col items-center justify-center gap-3 bg-slate-900/50 p-4 rounded-2xl md:w-24 shrink-0 border border-white/5">
                        <div className={`${item.type === 'timetable' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {item.type === 'timetable' ? <CalendarDays size={28} /> : <FileText size={28} />}
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Due</p>
                          <p className="text-xs font-bold text-white">{item.due.split(' ')[0]}</p>
                        </div>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getPriorityStyle(item.priority)}`}>
                          {item.tag}
                        </span>
                        {item.status === 'new' && (
                          <span className="bg-blue-500 text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-widest">New Update</span>
                        )}
                      </div>

                      <h3 className={`text-xl font-black tracking-tight ${item.status === 'completed' ? 'text-slate-500 line-through' : 'text-white group-hover:text-emerald-400 transition-colors'}`}>
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end md:border-l border-white/5 md:pl-6 min-w-[140px]">
                        {item.status === 'completed' ? (
                          <div className="flex flex-col items-center text-emerald-500">
                             <CheckCircle size={32} strokeWidth={3} />
                             <span className="text-[10px] font-black uppercase mt-2">Verified</span>
                          </div>
                        ) : (
                          <div className="w-full">
                            {item.type === 'timetable' ? (
                              <button className="w-full flex items-center justify-center gap-2 bg-white text-black text-xs font-black py-4 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5">
                                <Download size={16} /> PDF
                              </button>
                            ) : (
                              <button className="w-full group/btn flex items-center justify-center gap-2 bg-emerald-600 text-white text-xs font-black py-4 rounded-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20">
                                SUBMIT <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                              </button>
                            )}
                            <p className="text-center text-[9px] font-bold text-slate-500 mt-3 flex items-center justify-center gap-1">
                              <Clock size={10} /> Pending Review
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">End of Updates</p>
        </div>

      </div>
    </div>
  );
};

export default Assignments;