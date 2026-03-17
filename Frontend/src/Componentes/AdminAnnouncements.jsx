import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Send, Trash2, Edit3, X, Check, Eye } from 'lucide-react';
import axios from 'axios';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notices/all");
      setAnnouncements(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handlePost = async () => {
    if (!inputText.trim()) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/notices/add", {
        title: "Campus Update",
        content: inputText,
        category: "GENERAL"
      });
      setInputText("");
      fetchAnnouncements();
    } catch (err) { alert("Post failed!"); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the notice for all students.")) return;
    try {
      await axios.delete(`http://localhost:3000/api/notices/${id}`);
      setAnnouncements(announcements.filter(item => item._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notices/${id}`, editData);
      setIsEditing(null);
      fetchAnnouncements();
    } catch (err) { alert("Update failed!"); }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Create Announcement Section (Green Combo) */}
      <div className="bg-[#0f172a]/60 p-6 rounded-[1.5rem] border border-emerald-500/20 shadow-xl">
        <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Megaphone size={20} className="text-emerald-500" /> Create Announcement
        </h3>
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Write your campus update here..." 
          className="w-full bg-slate-900/80 border border-white/5 rounded-2xl p-4 text-sm text-white min-h-[100px] focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-inner"
        ></textarea>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 italic">Broadcast to Smart Campus Dashboard</span>
          <button 
            onClick={handlePost}
            disabled={loading}
            className="px-8 py-2.5 bg-emerald-600 text-white text-xs rounded-xl font-black flex items-center gap-2 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-900/40"
          >
            {loading ? "SENDING..." : "POST NOW"} <Send size={14} />
          </button>
        </div>
      </div>

      {/* Announcements List (Medium View) */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] px-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Recent Feed
        </h4>
        
        <div className="grid gap-4">
          {announcements.map(item => (
            <div key={item._id} className="group bg-[#0a0f1c] p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-start justify-between hover:border-emerald-500/30 transition-all duration-300 shadow-2xl">
              
              <div className="flex gap-5 flex-1 pr-4">
                <div className="w-1 h-auto bg-emerald-500/20 group-hover:bg-emerald-500 rounded-full transition-all duration-500 shrink-0"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {item.category || 'GENERAL'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Calendar size={12}/> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Medium Sized Content: Na zyada chota, na bahut bada */}
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {item.content.length > 180 ? `${item.content.substring(0, 180)}...` : item.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 md:mt-0 shrink-0 self-end md:self-start">
                <button onClick={() => setViewingNotice(item)} className="p-2.5 bg-slate-900 text-slate-500 hover:text-emerald-400 rounded-xl border border-white/5 transition-all">
                  <Eye size={16} />
                </button>
                <button onClick={() => { setIsEditing(item._id); setEditData(item); }} className="p-2.5 bg-slate-900 text-slate-500 hover:text-emerald-400 rounded-xl border border-white/5 transition-all">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-slate-900 text-slate-500 hover:text-rose-500 rounded-xl border border-white/5 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL (Full Details) --- */}
      {(viewingNotice || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#0f172a] border border-emerald-500/20 w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in duration-200">
            
            <button onClick={() => { setViewingNotice(null); setIsEditing(null); }} className="absolute top-8 right-8 text-slate-500 hover:text-white">
              <X size={28} />
            </button>

            <div className="mb-6">
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">
                 {isEditing ? "Update Logic" : "Announcement Detail"}
               </span>
               <div className="h-1 w-10 bg-emerald-500 mt-2 rounded-full"></div>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <textarea 
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-2xl p-5 text-white text-sm min-h-[180px] outline-none focus:border-emerald-500 transition-all"
                  value={editData.content}
                  onChange={(e) => setEditData({...editData, content: e.target.value})}
                />
                <button onClick={() => handleUpdate(isEditing)} className="w-full bg-emerald-600 py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                  <Check size={20} /> SYNC CHANGES
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-slate-200 leading-relaxed text-base bg-slate-900/50 p-6 rounded-[1.5rem] border border-white/5 max-h-[350px] overflow-y-auto custom-scrollbar">
                  {viewingNotice.content}
                </div>
                <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Published on Dashboard</div>
                  <span>{new Date(viewingNotice.createdAt).toDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;