import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const Fees = () => {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="main-card bg-gradient-to-br from-slate-900 to-[#0f172a] p-10 rounded-[2.5rem] border border-white/5">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4">
          <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Balance Amount</h3>
          <div className="text-5xl font-black text-white">$2,450.00</div>
          <p className="text-rose-400 text-sm font-bold italic">Due date: March 10th</p>
        </div>
        <button className="h-fit bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2">
          <CreditCard size={20}/> Pay Now
        </button>
      </div>
    </motion.div>
  );
};

export default Fees;