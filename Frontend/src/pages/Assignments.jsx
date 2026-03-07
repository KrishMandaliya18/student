import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CalendarDays, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download
} from 'lucide-react';

const Assignments = () => {
  // Ye data Admin panel se aayega
  const feedItems = [
    {
      id: 1,
      type: 'assignment',
      title: "React + GSAP Architecture",
      tag: "Frontend",
      due: "05 March",
      status: "pending",
      priority: "high",
      description: "Complete the landing page animation using GSAP ScrollTrigger."
    },
    {
      id: 2,
      type: 'timetable',
      title: "Updated Semester Exam Schedule",
      tag: "Exam Cell",
      due: "Released Today",
      status: "new",
      priority: "medium",
      attachment: "timetable_v2.pdf"
    },
    {
      id: 3,
      type: 'assignment',
      title: "Database Schema Design",
      tag: "Backend",
      due: "04 March",
      status: "completed",
      priority: "normal",
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Updates</h1>
            <p className="text-slate-500 text-sm">From Admin & Faculty</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-indigo-500/20 block leading-none">03</span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Active Tasks</span>
          </div>
        </div>

        {/* List Container */}
        <div className="space-y-4">
          <AnimatePresence>
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`relative overflow-hidden backdrop-blur-xl border-l-4 p-5 rounded-2xl border ${
                  item.status === 'completed' 
                  ? 'bg-slate-900/40 border-l-emerald-500 border-white/5 opacity-60' 
                  : 'bg-white/5 border-l-indigo-500 border-white/10 hover:bg-white/[0.08]'
                } transition-all duration-300`}>
                  
                  <div className="flex gap-5">
                    {/* Icon Box */}
                    <div className={`hidden sm:flex h-12 w-12 rounded-xl items-center justify-center shrink-0 ${
                      item.type === 'timetable' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {item.type === 'timetable' ? <CalendarDays size={24} /> : <FileText size={24} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityColor(item.priority)}`}>
                          {item.tag}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Clock size={12} /> {item.due}
                        </span>
                      </div>

                      <h3 className={`text-lg font-bold leading-snug ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-slate-500 text-xs mt-1 line-clamp-1">{item.description}</p>
                      )}

                      {/* Action Area */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           {item.status === 'completed' ? (
                             <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                               <CheckCircle size={14} /> Task Finished
                             </span>
                           ) : (
                             <span className="text-indigo-400 text-xs font-bold flex items-center gap-1">
                               <AlertCircle size={14} /> Action Required
                             </span>
                           )}
                        </div>

                        {item.type === 'timetable' ? (
                          <button className="flex items-center gap-2 bg-white text-black text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-indigo-400 hover:text-white transition-colors">
                            <Download size={14} /> GET PDF
                          </button>
                        ) : item.status !== 'completed' && (
                          <button className="group/btn flex items-center gap-1 text-white text-[11px] font-bold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all">
                            SUBMIT <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Assignments;