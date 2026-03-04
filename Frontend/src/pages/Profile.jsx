import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, BookOpen, Calendar, Award } from 'lucide-react';

const Profile = () => {
  const studentData = {
    name: "Krish",
    role: "Student",
    id: "SC-2026-KR",
    email: "krish@smartcampus.edu",
    phone: "+91 98765 43210",
    course: "B.Tech Computer Science",
    semester: "6th Semester",
    address: "Mumbai, Maharashtra, India",
    skills: ["React.js", "GSAP", "Tailwind CSS", "Node.js"]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* 1. PROFILE HEADER CARD */}
      <div className="relative main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 lg:p-12 rounded-[3rem] border border-white/5 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] overflow-hidden border-4 border-indigo-500/20 p-1">
              <img 
                src={`https://ui-avatars.com/api/?name=${studentData.name}&background=4f46e5&color=fff&size=256&bold=true`} 
                alt="Profile" 
                className="w-full h-full rounded-[2.2rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0f172a] shadow-lg"></div>
          </div>

          {/* Basic Info */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{studentData.name}</h2>
              <span className="px-4 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20 h-fit w-fit mx-auto md:mx-0">
                {studentData.id}
              </span>
            </div>
            <p className="text-slate-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
              <BookOpen size={18} className="text-indigo-500" /> {studentData.course}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Mail size={14}/> {studentData.email}</div>
              <div className="flex items-center gap-2 text-sm text-slate-500"><Phone size={14}/> {studentData.phone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Academic Details */}
        <div className="md:col-span-2 main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="text-indigo-500" size={20} /> Academic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Current Semester</p>
              <p className="text-white font-semibold">{studentData.semester}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Joining Date</p>
              <p className="text-white font-semibold">August 2023</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Campus Location</p>
              <p className="text-white font-semibold flex items-center gap-1"><MapPin size={14} className="text-rose-500" /> Main Building, Block A</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Academic Status</p>
              <p className="text-green-400 font-bold">Active / Regular</p>
            </div>
          </div>
        </div>

        {/* Skills / Badges */}
        <div className="main-card bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {studentData.skills.map(skill => (
              <span key={skill} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 border border-white/5 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Attendance Streak</p>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;