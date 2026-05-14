import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Calendar, Clock, Send, Trash2, Edit3, X, Check, Eye, 
  GraduationCap, Trophy, FileText, AlertCircle, Info 
} from 'lucide-react'; 
import axios from 'axios';
// 1. Toastify Imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "", category: "GENERAL" });

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const categoryStyles = {
    GENERAL: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Info size={14} /> },
    EXAM: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: <FileText size={14} /> },
    ACADEMIC: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <GraduationCap size={14} /> },
    EVENT: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Trophy size={14} /> },
    FEES_PENDING: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <AlertCircle size={14} /> },
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("/api/notices/all", authConfig);
      setAnnouncements(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(date).replace(',', ' •');
  };

  const handlePost = async () => {
    if (!inputText.trim() || !title.trim()) { 
        toast.warn("Title and Content are required!"); 
        return; 
    }
    try {
      setLoading(true);
      await axios.post("/api/notices/add", { title, content: inputText, category }, authConfig);
      setInputText(""); setTitle(""); fetchAnnouncements();
      // 2. Success Toast
      toast.success("Announcement Posted Successfully!", { theme: "dark" });
    } catch (err) { 
        toast.error("Failed to post announcement."); 
    } finally { setLoading(false); }
  };

  // 3. Custom Delete Confirmation Toast
  const confirmDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="p-1">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3">Delete this notice permanently?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => { executeDelete(id); closeToast(); }}
              className="bg-rose-600 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-500 transition-all"
            >
              Confirm
            </button>
            <button 
              onClick={closeToast}
              className="bg-slate-700 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false, theme: "dark" }
    );
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`/api/notices/${id}`, authConfig);
      setAnnouncements(announcements.filter(item => item._id !== id));
      toast.info("Notice removed from feed.", { theme: "dark" });
    } catch (err) { 
        toast.error("Delete failed!"); 
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/notices/${id}`, editData, authConfig);
      setIsEditing(null); 
      fetchAnnouncements();
      toast.success("Notice updated!", { theme: "dark" });
    } catch (err) { 
        toast.error("Update failed!"); 
    }
  };

  return (
    <div className="max-w-5xl space-y-6 mx-auto p-4 font-sans">
      {/* 4. Toast Container */}
      <ToastContainer position="bottom-right" />

      {/* Create Announcement Section */}
      <div className="bg-[#0f172a]/60 p-6 rounded-[2.5rem] border border-emerald-500/20 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Megaphone size={20} className="text-emerald-500" /> Create Announcement
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement Title"
            className="flex-1 bg-slate-900/80 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-emerald-500 outline-none font-bold"
          />
          <select 
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900/80 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-emerald-500 outline-none font-bold min-w-[180px]"
          >
            <option value="GENERAL">General Notice</option>
            <option value="FEES_PENDING">Fees Pending</option>
            <option value="EXAM">Exam News</option>
            <option value="ACADEMIC">Academic Update</option>
            <option value="EVENT">Campus Event</option>
          </select>
        </div>

        <textarea 
          value={inputText} onChange={(e) => setInputText(e.target.value)}
          placeholder="Write your update..." 
          className="w-full bg-slate-900/80 border border-white/5 rounded-2xl p-4 text-sm text-white min-h-[120px] focus:border-emerald-500 outline-none resize-none"
        ></textarea>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 italic">Broadcast to Student Dashboard</span>
          <button 
            onClick={handlePost} disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white text-xs rounded-xl font-black flex items-center gap-2 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "SENDING..." : "POST NOW"} <Send size={14} />
          </button>
        </div>
      </div>

      {/* Feed Section */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] px-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Recent Feed
        </h4>
        
        <div className="grid gap-4">
          {announcements.map(item => {
            const style = categoryStyles[item.category] || categoryStyles.GENERAL;
            return (
              <div key={item._id} className="group bg-[#0a0f1c] p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-start justify-between hover:border-white/10 transition-all">
                <div className="flex gap-5 flex-1 pr-4">
                  <div className={`w-1 h-auto ${style.bg.replace('10', '40')} rounded-full shrink-0 transition-all group-hover:scale-y-110`}></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`${style.color} ${style.bg} ${style.border} text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border flex items-center gap-1.5`}>
                        {style.icon} {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Calendar size={11}/> {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                    <h5 className="text-white font-bold text-base">{item.title}</h5>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.content.length > 180 ? `${item.content.substring(0, 180)}...` : item.content}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button onClick={() => setViewingNotice(item)} className="p-2.5 bg-slate-900 text-slate-500 hover:text-emerald-400 rounded-xl border border-white/5"><Eye size={16} /></button>
                  <button onClick={() => { setIsEditing(item._id); setEditData(item); }} className="p-2.5 bg-slate-900 text-slate-500 hover:text-emerald-400 rounded-xl border border-white/5"><Edit3 size={16} /></button>
                  {/* Updated to confirmDelete */}
                  <button onClick={() => confirmDelete(item._id)} className="p-2.5 bg-slate-900 text-slate-500 hover:text-rose-500 rounded-xl border border-white/5"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View/Edit */}
      {(viewingNotice || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 relative">
            <button onClick={() => { setViewingNotice(null); setIsEditing(null); }} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={28} /></button>
            {isEditing ? (
              <div className="space-y-6 pt-6">
                <h3 className="text-white font-black uppercase tracking-widest text-xs">Edit Notice</h3>
                <input className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-bold" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                <textarea className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm min-h-[150px]" value={editData.content} onChange={(e) => setEditData({...editData, content: e.target.value})} />
                <button onClick={() => handleUpdate(isEditing)} className="w-full bg-emerald-600 py-4 rounded-xl font-black text-white hover:bg-emerald-500 transition-all"><Check size={20} className="inline mr-2"/> SYNC CHANGES</button>
              </div>
            ) : (
              <div className="space-y-6 pt-6">
                <div className="flex flex-col gap-1">
                    <span className={`${categoryStyles[viewingNotice.category]?.color} text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5`}>
                      {categoryStyles[viewingNotice.category]?.icon} {viewingNotice.category}
                    </span>
                    <h2 className="text-2xl font-black text-white">{viewingNotice.title}</h2>
                    <span className="text-slate-500 text-[11px] font-bold flex items-center gap-1.5 mt-1"><Clock size={12} /> Posted: {formatDateTime(viewingNotice.createdAt)}</span>
                </div>
                <div className="text-slate-200 text-base bg-slate-900/50 p-6 rounded-2xl border border-white/5 max-h-[350px] overflow-y-auto leading-loose whitespace-pre-wrap">{viewingNotice.content}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;