import React, { useEffect, useState } from 'react';
import { FileText, Download, ArrowRight, Clock, Box, Calendar, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import axios from 'axios';

const Assignments = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example Data (Jab backend se data aayega to aisa dikhega)
  // [
  //   { _id: '1', title: 'React Project Report', subject: 'Web Dev', createdAt: '2026-03-20T10:00:00Z', filePath: 'uploads/file1.pdf' },
  //   { _id: '2', title: 'Unit 3 Question Bank', subject: 'Maths', createdAt: '2026-03-21T08:30:00Z', filePath: 'uploads/file2.pdf' }
  // ]

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/assignments/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".task-card", 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 text-slate-300 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Modern Header */}
        <div className="relative mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/5 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              Material <span className="text-emerald-500">Center</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <AlertCircle size={12} className="text-emerald-500" /> New materials available for download
            </p>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex justify-center py-20 animate-pulse font-black text-slate-700 tracking-widest uppercase italic">Fetching Database...</div>
          ) : tasks.length > 0 ? (
            tasks.map((t) => (
              <div 
                key={t._id} 
                className="task-card group relative bg-slate-900/30 border border-white/5 p-1 rounded-[1.8rem] transition-all hover:bg-slate-800/40 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="bg-[#0f172a]/80 rounded-[1.6rem] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl border border-white/5 shadow-2xl">
                  
                  <div className="flex items-start gap-5">
                    {/* File Icon with Date Badge */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                        <FileText size={28} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Subject Tag */}
                      <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-md uppercase tracking-widest mb-2 border border-emerald-500/10">
                        {t.subject || "General"}
                      </span>
                      {/* Title */}
                      <h3 className="text-base font-black text-white uppercase tracking-tight line-clamp-1 mb-1 group-hover:text-emerald-400 transition-colors">
                        {t.title}
                      </h3>
                      {/* Time and Date */}
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter">
                          <Calendar size={12} className="text-slate-600" />
                          {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tighter border-l border-white/10 pl-4">
                          <Clock size={12} className="text-slate-600" />
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="md:hidden">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Ready to Download</p>
                    </div>
                    <a 
                      href={`http://localhost:3000/${t.filePath}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group/btn flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1"
                    >
                      Download <Download size={14} className="group-hover/btn:animate-bounce" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center opacity-10">
               <Box size={60} className="mb-4 text-slate-400" />
               <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-400">Inventory Empty</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Assignments;