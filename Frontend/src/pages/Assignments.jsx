import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, CheckCircle2, Clock } from 'lucide-react';

const Assignments = () => {
  // Socho ye list Admin ne bhej di hai (Backend se fetch hogi)
  const assignments = [
    { 
      id: 1, 
      title: "React + GSAP Architecture", 
      subject: "Web Development", 
      deadline: "05 March", 
      status: "Pending",
      priority: "High" 
    },
    { 
      id: 2, 
      title: "Database Schema Design", 
      subject: "Backend Dev", 
      deadline: "04 March", 
      status: "Submitted",
      priority: "Medium" 
    },
    { 
      id: 3, 
      title: "UI/UX Figma Prototype", 
      subject: "Design", 
      deadline: "08 March", 
      status: "Pending",
      priority: "Normal" 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-xl mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <ClipboardList className="text-indigo-400" /> My Assignments
        </h3>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          {assignments.filter(a => a.status === "Pending").length} New
        </span>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {assignments.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className={`p-5 rounded-[2rem] border transition-all ${
              item.status === "Submitted" 
              ? "bg-[#0f172a]/40 border-green-500/20 opacity-70" 
              : "bg-[#1e293b] border-white/5 shadow-xl"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">
                  {item.subject}
                </p>
                <h4 className={`font-bold ${item.status === "Submitted" ? "text-slate-500 line-through" : "text-white text-lg"}`}>
                  {item.title}
                </h4>
              </div>
              {item.status === "Submitted" ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <div className={`h-2 w-2 rounded-full animate-pulse ${item.priority === "High" ? "bg-red-500" : "bg-yellow-500"}`} />
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Calendar size={14} />
                  <span>Due: {item.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Clock size={14} />
                  <span>Status: {item.status}</span>
                </div>
              </div>

              {item.status === "Pending" && (
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-xl transition-all uppercase">
                  Submit Now
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Assignments;