import React, { useEffect, useState } from 'react';
import { FileText, Download, Box, Loader2 } from 'lucide-react';
import axios from 'axios';

const Assignments = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('Assignments');
  const [loading, setLoading] = useState(true);
  
  const API_URL = "http://localhost:3000"; 

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/assignments/all`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    return () => controller.abort();
  }, []);

  const filtered = tasks.filter(t => 
    t.subject && t.subject.trim().toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#020617] p-6 pt-8 text-slate-200 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            Student <span className="text-indigo-500">Portal</span>
          </h1>
          
          {/* Tabs: Updated font size to text-sm */}
          <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
            {['Assignments', 'Time Table'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-slate-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-xs font-bold tracking-widest uppercase">Syncing Data...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((t) => (
              <div key={t._id} className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 transition-all backdrop-blur-md">
                <div className="flex items-center gap-5">
                  {/* Icon size increased */}
                  <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    {/* Title size changed to text-base (Standard) */}
                    <h3 className="text-white font-bold text-base uppercase leading-tight tracking-wide">
                      {t.title}
                    </h3>
                    {/* Date size changed to text-[10px] for readability */}
                    <p className="text-[10px] text-slate-400 tracking-wider mt-1.5 uppercase font-medium">
                      {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} | {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <a 
                  href={`${API_URL}/${t.filePath.replace(/\\/g, '/')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase">Download</span>
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-24 text-white/10 border-2 border-dashed border-white/5 rounded-[3rem]">
              <Box size={56} className="mx-auto mb-4" />
              <p className="font-black uppercase text-xs tracking-[0.3em]">No Content Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;