import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, ChevronRight, Search, X, Calendar, Bell } from 'lucide-react';
import axios from 'axios';
import { gsap } from 'gsap';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedNotice, setSelectedNotice] = useState(null); 
  
  const cardsRef = useRef([]);

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

  useEffect(() => {
    fetchNotices();
  }, []);

  
  const filteredNotices = notices.filter(notice => {
    const date = new Date(notice.createdAt);
    const dateString = date.toLocaleDateString('en-GB'); 
    const monthName = date.toLocaleString('default', { month: 'long' }).toLowerCase();
    const day = date.getDate().toString();
    const search = searchTerm.toLowerCase();

    return (
      notice.title.toLowerCase().includes(search) ||
      notice.content.toLowerCase().includes(search) ||
      dateString.includes(search) ||
      monthName.includes(search) ||
      day === search
    );
  });

  useEffect(() => {
    if (!loading && filteredNotices.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, searchTerm]);

  return (
    <div className="p-6 md:p-10 bg-[#020617] min-h-screen text-slate-200">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
              <Megaphone className="text-indigo-500" size={32} />
              Campus <span className="text-indigo-500 underline underline-offset-8">Notices</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-3 uppercase italic">Live Student Updates</p>
          </div>

          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search by date (14/03), month or content..."
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5">
          {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-32 w-full bg-slate-900/40 rounded-[2rem] animate-pulse border border-white/5" />)}
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <div 
                key={notice._id} 
                ref={el => cardsRef.current[index] = el}
                className={`group relative bg-[#0a0f1c] border p-6 rounded-[2rem] transition-all duration-500 shadow-2xl overflow-hidden ${
                  notice.category === 'FEES_PENDING' ? 'border-rose-500/30 hover:bg-rose-900/5' : 'border-white/5 hover:border-indigo-500/40 hover:bg-indigo-900/5'
                }`}
              >
                <div className={`absolute -right-20 -top-20 w-40 h-40 blur-[80px] transition-all ${
                  notice.category === 'FEES_PENDING' ? 'bg-rose-500/5 group-hover:bg-rose-500/10' : 'bg-indigo-500/5 group-hover:bg-indigo-500/10'
                }`} />

                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        notice.category === 'FEES_PENDING' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      }`}>
                        {notice.category || 'GENERAL'}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                        <Calendar size={12} className="text-indigo-600" /> {new Date(notice.createdAt).toLocaleDateString('en-GB')}
                      </span>
                      <div className="h-3 w-px bg-white/10 mx-1" />
                      <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${notice.senderRole === 'admin' ? 'bg-amber-500' : notice.senderRole === 'hod' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                        {notice.senderRole}: {notice.senderName || 'Staff'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {notice.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed max-w-3xl line-clamp-2">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-end md:pl-6">
                    <button 
                      onClick={() => setSelectedNotice(notice)}
                      className={`p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-500 group-hover:text-white transition-all shadow-xl transform group-hover:scale-105 ${
                        notice.category === 'FEES_PENDING' ? 'group-hover:bg-rose-600 group-hover:border-rose-400' : 'group-hover:bg-indigo-600 group-hover:border-indigo-400'
                      }`}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <Bell size={40} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matches found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        {selectedNotice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={() => setSelectedNotice(null)} />
            
            <div className={`relative bg-[#0f172a] border w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300 ${
              selectedNotice.category === 'FEES_PENDING' ? 'border-rose-500/20' : 'border-indigo-500/20'
            }`}>
              <button onClick={() => setSelectedNotice(null)} className="absolute top-8 right-8 p-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-500 rounded-xl transition-all">
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <span className={`font-black text-[10px] tracking-[0.3em] uppercase ${selectedNotice.category === 'FEES_PENDING' ? 'text-rose-500' : 'text-indigo-400'}`}>
                  {selectedNotice.category || 'CAMPUS UPDATE'}
                </span>
              </div>
              
              <h2 className="text-3xl font-black mt-4 text-white leading-tight">{selectedNotice.title}</h2>
              
              <div className="flex flex-wrap items-center gap-4 mt-6 mb-8 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> {new Date(selectedNotice.createdAt).toLocaleDateString('en-GB')}</div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${selectedNotice.senderRole === 'admin' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                   {selectedNotice.senderRole} Broadcasting
                </div>
              </div>

              <div className="text-slate-300 leading-relaxed text-lg max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {selectedNotice.content}
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                  selectedNotice.category === 'FEES_PENDING' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                }`}>
                  {selectedNotice.senderName ? selectedNotice.senderName[0] : 'S'}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">Verified by {selectedNotice.senderName || 'Office'}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{selectedNotice.senderRole} Department</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
