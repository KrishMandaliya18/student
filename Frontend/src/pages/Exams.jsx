import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';

const Exams = () => {
  const examList = [
    { subject: "Distributed Systems", date: "Mar 15, 2026", time: "10:00 AM" },
    { subject: "AI & Machine Learning", date: "Mar 18, 2026", time: "02:00 PM" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
      {examList.map((exam, index) => (
        <div key={index} className="main-card bg-[#0f172a]/60 p-6 rounded-3xl border border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-400"><FileText /></div>
            <div>
              <h4 className="font-bold text-white">{exam.subject}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Calendar size={12}/> {exam.date}</p>
            </div>
          </div>
          <span className="text-sm font-black text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-xl">{exam.time}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default Exams;
