import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const NoticeBoard = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div key={i} whileHover={{ x: 10 }} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex gap-4">
          <Megaphone className="text-yellow-500 shrink-0" />
          <div>
            <h4 className="font-bold text-white">Campus Event Notice #{i}</h4>
            <p className="text-sm text-slate-400 mt-1">The annual technical fest is scheduled for the last week of April. Registration starts tomorrow.</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NoticeBoard;