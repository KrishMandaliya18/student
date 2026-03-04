import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Edit2, X, Trash2, Lock } from 'lucide-react';
import axios from 'axios'; // Step 2 ke liye zaroori

const FacultySettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityId: '',
    password: '' 
  });

  // --- STEP 2: BACKEND SE DATA LAYEIN ---
useEffect(() => {
  const fetchProfile = async () => {
    try {
      // 1. Storage check (sessionStorage use karein)
      const storedData = sessionStorage.getItem('userInfo');
      if (!storedData) {
        console.error("No user info found");
        setLoading(false);
        return;
      }

      const userInfo = JSON.parse(storedData);
      
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };

      // 2. Sahi URL use karein (Backend router ke hisaab se /api/auth/profile)
      const { data } = await axios.get('http://localhost:3000/api/auth/profile', config);
      
      setFormData({
        name: data.name,
        email: data.email,
        universityId: data.universityId || '',
        password: '' 
      });
      setLoading(false);
    } catch (error) {
      console.error("Profile load nahi ho payi", error);
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 3: BACKEND ME SAVE KAREIN ---
  const handleSave = async () => {
  try {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.put('http://localhost:3000/api/auth/profile/update', formData, config);         
    
    // 1. Storage update karein (Headers isi key ko read karta hai)
    const updatedInfo = { ...userInfo, name: data.name, email: data.email };
    sessionStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    
    // 2. Header ko signal bhejein (Custom Event)
    window.dispatchEvent(new Event('profileUpdated'));

    alert("Profile Successfully Updated!");
    setIsEditing(false);
    
    setFormData({
      ...formData,
      name: data.name,
      email: data.email,
      password: '' 
    });

  } catch (error) {
    alert(error.response?.data?.message || "Update fail ho gaya");
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    // Refresh page to reset data or refetch
    window.location.reload(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  if (loading) return <div className="text-white p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-white italic tracking-tight">PROFILE</h3>
          <p className="text-slate-500 text-sm">View and manage your faculty profile</p>
        </div>
        
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all">
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full font-bold hover:bg-rose-500 hover:text-white transition-all">
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-[#0f172a]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-sm">
        
        {/* Full Name */}
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
            className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${isEditing ? "bg-white/10 border-emerald-500/50 text-white border ring-4 ring-emerald-500/5" : "bg-white/5 border-transparent text-slate-400 border cursor-default"} focus:outline-none`} 
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <Mail size={18}/> Email Address
          </label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            disabled={!isEditing}
            className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${isEditing ? "bg-white/10 border-emerald-500/50 text-white border ring-4 ring-emerald-500/5" : "bg-white/5 border-transparent text-slate-400 border cursor-default"} focus:outline-none`} 
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <Lock size={18}/> {isEditing ? "New Password" : "Password"}
          </label>
          <input 
            type="password" 
            name="password" 
            value={isEditing ? formData.password : "********"} 
            onChange={handleChange} 
            disabled={!isEditing}
            placeholder={isEditing ? "Enter new password" : ""}
            className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${isEditing ? "bg-white/10 border-emerald-500/50 text-white border ring-4 ring-emerald-500/5" : "bg-white/5 border-transparent text-slate-400 border cursor-default"} focus:outline-none`} 
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <button onClick={handleSave} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98]">
            <Save size={20} /> Save Changes
          </button>
        )}
      </div>

      {/* Logout Section */}
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

export default FacultySettings;