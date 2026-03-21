import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Trash2, PlusCircle, ClipboardList, Calendar, Eye } from 'lucide-react';
import { gsap } from 'gsap';
import axios from 'axios';

const UploadNotes = () => {
  const [activeCategory, setActiveCategory] = useState('Assignments');
  const fileInputRef = useRef(null);
  
  // State ko empty array se start karein
const [materials, setMaterials] = useState([]);
const [loading, setLoading] = useState(false);

const token = localStorage.getItem('token') || sessionStorage.getItem('token');
 useEffect(() => {
  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/assignments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials", error);
    }
  };
  fetchMaterials();
}, [activeCategory]); // Category badalne par phir se fetch karein

  const categories = [
    { name: 'Assignments', icon: <ClipboardList size={18} /> },
    { name: 'Time Table', icon: <Calendar size={18} /> },
  ];
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file); // 'file' wahi naam hai jo backend multer mein hai
  formData.append('title', file.name); 
  formData.append('subject', activeCategory); // Category ko subject ki tarah bhej rahe hain

  try {
    setLoading(true);
    const response = await axios.post(
      'http://localhost:3000/api/assignments/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    );
    
    // Upload ke baad list update karein
    setMaterials([response.data.newAssignment, ...materials]);
    alert("File Uploaded Successfully!");
  } catch (error) {
    alert("Upload failed!");
    console.error(error);
  } finally {
    setLoading(false);
    event.target.value = null;
  }
};

  const filteredMaterials = materials.filter(m => m.type === activeCategory);

  return (
    <div className="h-full flex flex-col space-y-6 font-sans p-2 overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
          Material <span className="text-emerald-500 text-3xl">Hub</span>
        </h2>
        <div className="flex gap-2 p-1 bg-slate-900/80 rounded-2xl border border-white/5 shadow-2xl">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${
                activeCategory === cat.name 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-500 hover:text-white'
              }`}
            >
              {cat.icon} {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        <div className="flex flex-col space-y-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.pptx,.jpg,.png"
          />
          <div 
            onClick={() => fileInputRef.current.click()}
            className="flex-1 bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center hover:border-emerald-500/40 transition-all group cursor-pointer shadow-inner min-h-[300px]"
          >
            <div className="w-24 h-24 bg-emerald-500/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/10">
              <UploadCloud size={48} className="text-emerald-500/80" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Click to Upload</h3>
            <p className="text-slate-600 text-[10px] mt-2 font-bold uppercase tracking-widest leading-none">PDF, DOCX, PPT, JPG up to 50MB</p>
            <div className="mt-8 px-10 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl transition-all active:scale-95">
              <PlusCircle size={16} /> ADD {activeCategory.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="bg-[#0a0f1c]/60 rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h4 className="font-black text-white uppercase tracking-widest text-[11px] italic">Recent {activeCategory}</h4>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg uppercase tracking-widest">
              {filteredMaterials.length} File(s)
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {filteredMaterials.length > 0 ? (
              <div className="grid gap-3">
                {filteredMaterials.map((file, i) => (
                  <div key={i} className="file-card flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all group border-l-2 border-l-transparent hover:border-l-emerald-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <FileText size={20} />
                      </div>
                      <div className="max-w-[150px] md:max-w-[200px]">
                        <p className="text-xs font-black text-white truncate leading-none mb-1">{file.name}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                    <a 
  href={`http://localhost:3000/${file.filePath}`} // Backend static folder ka path
  target="_blank" 
  rel="noopener noreferrer"
  className="..."
>
  <Eye size={18} />
</a>
                      <button 
                        onClick={() => deleteFile(materials.indexOf(file))}
                        className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete File"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                <FileText size={48} className="text-slate-600 mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">No {activeCategory} Sent Yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;