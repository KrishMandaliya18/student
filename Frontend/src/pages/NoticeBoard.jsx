import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Bell, Info, TriangleAlert, ArrowRight } from 'lucide-react';

const NoticeBoard = () => {
  const notices = [
    {
      id: 1,
      type: "Event",
      title: "Annual Tech Fest 2026",
      desc: "The annual technical fest is scheduled for April. Registration starts tomorrow on the portal.",
      date: "07 Mar",
      urgent: true
    },
    {
      id: 2,
      type: "Holiday",
      title: "Holi Break Announcement",
      desc: "College will remain closed from 14th to 17th March for Holi celebrations. Enjoy safely!",
      date: "05 Mar",
      urgent: false
    },
    {
      id: 3,
      type: "Academic",
      title: "Project Submission Deadline",
      desc: "Final year project abstracts must be submitted by this weekend to your respective mentors.",
      date: "04 Mar",
      urgent: false
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Section Title */}
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Bell className="text-yellow-500" size={20} />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Notice Board</h3>
      </div>

      <div className="grid gap-4">
        {notices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="group relative overflow-hidden"
          >
            <div className={`p-5 rounded-[2rem] border transition-all duration-300 ${
              notice.urgent 
              ? "bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20" 
              : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
            }`}>
              
              <div className="flex gap-5">
                {/* Left Date Side */}
                <div className="flex flex-col items-center justify-center min-w-[60px] h-20 bg-white/5 rounded-2xl border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                   <span className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">
                     {notice.date.split(' ')[1]}
                   </span>
                   <span className="text-2xl font-black text-white leading-none">
                     {notice.date.split(' ')[0]}
                   </span>
                </div>

                {/* Content Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      notice.urgent ? "bg-red-500 text-white" : "bg-indigo-500/20 text-indigo-400"
                    }`}>
                      {notice.type}
                    </span>
                    {notice.urgent && <TriangleAlert size={14} className="text-red-500 animate-pulse" />}
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {notice.desc}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {/* Placeholder for small avatars or icons */}
                      <div className="w-6 h-6 rounded-full border-2 border-[#0a0f18] bg-slate-700 flex items-center justify-center text-[8px] text-white">AD</div>
                      <div className="w-6 h-6 rounded-full border-2 border-[#0a0f18] bg-indigo-600 flex items-center justify-center">
                        <Info size={10} className="text-white" />
                      </div>
                    </div>

                    <button className="flex items-center gap-1 text-[11px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">
                      Read Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Glow for Urgent Notices */}
              {notice.urgent && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 blur-[40px] rounded-full" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;