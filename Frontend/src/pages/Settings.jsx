import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Edit2, X, Trash2, Lock } from 'lucide-react';
import axios from 'axios';
// 1. Toastify Imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedData = sessionStorage.getItem('userInfo');
        if (!storedData) {
          setLoading(false);
          return;
        }

        const userInfo = JSON.parse(storedData);
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        const { data } = await axios.get('/api/auth/profile', config);
        
        setFormData({
          name: data.name,
          email: data.email,
          universityId: data.universityId || ''
        });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load profile", { theme: "dark" });
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.put('/api/auth/profile/update', { 
        name: formData.name 
      }, config);         
      
      const updatedInfo = { ...userInfo, name: data.name };
      sessionStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      sessionStorage.setItem('student_Name', data.name);
      
      window.dispatchEvent(new Event('profileUpdated'));
      
      // 2. Success Toast
      toast.success("Display name updated!", {
        position: "top-right",
        theme: "dark",
        autoClose: 3000
      });

      setIsEditing(false);
    } catch (error) {
      // 3. Error Toast
      toast.error(error.response?.data?.message || "Update failed", {
        theme: "dark"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reloading to reset any unsaved input changes
    window.location.reload(); 
  };

  const handleLogout = async () => {
     try {
         const storedInfo = sessionStorage.getItem("userInfo");
         if (!storedInfo) {
             window.location.href = "/login";
             return;
         }
 
         const userData = JSON.parse(storedInfo);
         const token = sessionStorage.getItem("token");
 
         // 4. Logout Toast
         toast.info("Logging out...", { theme: "dark", autoClose: 1000 });
        
         await axios.post("/api/auth/logout", 
             { userId: userData.id }, 
             { headers: { Authorization: `Bearer ${token}` } }
         );
 
         sessionStorage.clear();
         setTimeout(() => {
            window.location.href = "/login";
         }, 1000);
     } catch (error) {
         sessionStorage.clear();
         window.location.href = "/login";
     }
 };

  if (loading) return <div className="text-white p-10 text-center font-black animate-pulse">LOADING PROFILE...</div>;

  return (
    <div className="max-w-2xl space-y-8 p-6">
      {/* 5. Toast Container */}
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">PROFILE</h3>
          <p className="text-slate-500 text-sm">You can only update your display name</p>
        </div>
        
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-indigo-500 border border-emerald-500/20 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all">
            <Edit2 size={16} /> Edit Name
          </button>
        ) : (
          <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full font-bold hover:bg-rose-500 hover:text-white transition-all">
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      <div className="bg-[#0f172a]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-sm">
        
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <User size={18}/> Full Name
          </label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${isEditing ? "bg-white/10 border-emerald-500/50 text-white border ring-4 ring-emerald-500/5" : "bg-white/5 border-transparent text-slate-400 border cursor-not-allowed"} focus:outline-none`} 
          />
        </div>

        <div className="space-y-2 opacity-70">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <Mail size={18}/> Email Address (View Only)
          </label>
          <input 
            type="email" 
            value={formData.email} 
            disabled={true}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border-transparent text-slate-500 border cursor-not-allowed focus:outline-none" 
          />
        </div>

        <div className="space-y-2 opacity-70">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <Lock size={18}/> Password
          </label>
          <input 
            type="password" 
            value="********" 
            disabled={true}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border-transparent text-slate-500 border cursor-not-allowed focus:outline-none"
          />
        </div>

        {isEditing && (
          <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98]">
            <Save size={20} /> Update Name
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="pt-4">
          <button onClick={handleLogout} className="w-full py-4 bg-rose-500/5 border border-rose-500/10 text-rose-500 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all group">
            <Trash2 size={16} className="group-hover:animate-bounce" /> Logout Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;