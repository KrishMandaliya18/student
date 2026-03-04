import React, { useState } from 'react';
import { Megaphone, Calendar, Send, Trash2 } from 'lucide-react'; // Trash2 icon add kiya

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: "Mid-semester exams will start from next Monday. Please download your admit cards.", date: "24 Oct 2025", seen: 124 }
  ]);
  const [inputText, setInputText] = useState("");

  const handlePost = () => {
    if (!inputText.trim()) return;

    const newPost = {
      id: Date.now(),
      text: inputText,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      seen: 0
    };

    setAnnouncements([newPost, ...announcements]);
    setInputText(""); 
  };

  // Delete function
  const handleDelete = (id) => {
    setAnnouncements(announcements.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Small Write Part */}
      <div className="bg-[#0f172a]/60 p-5 rounded-[1.5rem] border border-white/5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Megaphone size={18} className="text-emerald-500" /> New Announcement
        </h3>
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..." 
          className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-sm text-white min-h-[80px] focus:outline-none focus:border-emerald-500 transition-all resize-none"
        ></textarea>
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-slate-400 cursor-pointer hover:bg-emerald-500/10 transition-colors">All Students</span>
          </div>
          <button 
            onClick={handlePost}
            className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all active:scale-95"
          >
            Post <Send size={14} />
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest px-2">Past Announcements</h4>
        {announcements.map(item => (
          <div key={item.id} className="group bg-[#0f172a]/60 p-5 rounded-[1.5rem] border border-white/5 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-4 justify-between">
              <div className="flex gap-4">
                <div className="w-1 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-white text-sm font-medium leading-relaxed">{item.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                    <span className="text-emerald-500">{item.seen > 0 ? `Seen by ${item.seen} students` : 'Just posted'}</span>
                  </div>
                </div>
              </div>

              {/* Delete Icon - Yeh hover hone par visible hoga (group-hover) */}
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-slate-500 hover:text-red-500 transition-colors p-1"
                title="Delete Announcement"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;