import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, ChevronRight, Search, X, Calendar, Bell, Clock, 
  GraduationCap, Trophy, FileText, AlertCircle, Info 
} from 'lucide-react';
import axios from 'axios';
import { gsap } from 'gsap';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedNotice, setSelectedNotice] = useState(null); 
  
  const cardsRef = useRef([]);

  // --- Category Configurations (Admin se match karne ke liye) ---
  const categoryStyles = {
    GENERAL: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Info size={14} /> },
    EXAM: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: <FileText size={14} /> },
    ACADEMIC: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <GraduationCap size={14} /> },
    EVENT: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Trophy size={14} /> },
    FEES_PENDING: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <AlertCircle size={14} /> },
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/notices/all");
      setNotices(res.data);
    } catch (err) {
      console.error("Notice fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const filteredNotices = notices.filter(notice => {
    const search = searchTerm.toLowerCase();
    return (
      notice.title.toLowerCase().includes(search) ||
      notice.content.toLowerCase().includes(search) ||
      notice.category?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    if (!loading && filteredNotices.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, searchTerm, filteredNotices.length]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <style dangerouslySetInnerHTML={{__html: `
        body::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />

      <div className="max-w-6xl mx-auto w-full p-6 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
              <Megaphone className="text-indigo-500" size={32} />
              Campus <span className="text-indigo-500 underline underline-offset-8">Notices</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-3 uppercase italic">Live Student Updates</p>
          </div>

          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search notices..."
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 shadow-2xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Notices Content */}
        <div className="grid gap-4 pb-5">
          {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-40 w-full bg-slate-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />)}
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => {
              const style = categoryStyles[notice.category] || categoryStyles.GENERAL;
              return (
                <div 
                  key={notice._id} 
                  ref={el => cardsRef.current[index] = el}
                  className={`group relative bg-[#0a0f1c] border p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl border-white/5 hover:border-white/10`}
                >
                  {/* Category Vertical Accent Bar */}
                  <div className={`absolute left-0 top-10 bottom-10 w-1 ${style.bg.replace('10', '40')} rounded-r-full transition-all group-hover:w-1.5`} />

                  <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border flex items-center gap-1.5 ${style.color} ${style.bg} ${style.border}`}>
                          {style.icon} {notice.category || 'GENERAL'}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                          <Calendar size={12}/> {new Date(notice.createdAt).toLocaleDateString('en-GB')}
                          <span className="mx-1 text-slate-700">|</span>
                          <Clock size={12} className={style.color}/> {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{notice.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">{notice.content}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => setSelectedNotice(notice)}
                        className={`p-5 bg-slate-900 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all transform hover:rotate-90 shadow-xl ${notice.category === 'EXAM' ? 'hover:bg-rose-600' : 'hover:bg-indigo-600'}`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Bell size={40} className="mx-auto text-slate-800 mb-4 animate-bounce" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No notices found in archives</p>
            </div>
          )}
        </div>

        {/* Modal remains fixed */}
        {selectedNotice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedNotice(null)} />
            <div className="relative bg-[#0a0f1c] border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
              <button onClick={() => setSelectedNotice(null)} className="absolute top-8 right-8 p-3 bg-slate-800 rounded-2xl hover:bg-rose-500 transition-colors">
                <X size={20} />
              </button>
              
              <div className="flex flex-col gap-1 mb-6">
                <span className={`${categoryStyles[selectedNotice.category]?.color} text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5`}>
                   {categoryStyles[selectedNotice.category]?.icon} {selectedNotice.category || 'GENERAL'}
                </span>
                <h2 className="text-3xl font-black text-white mt-2">{selectedNotice.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-slate-500 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(selectedNotice.createdAt).toLocaleDateString('en-GB')}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(selectedNotice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
              </div>

              <div className="text-slate-300 leading-relaxed text-lg max-h-[50vh] overflow-y-auto pr-4 no-scrollbar whitespace-pre-wrap">
                {selectedNotice.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;