import React, { useEffect, useRef, useState } from 'react';
import { Search, Calendar as CalendarIcon, Download, UserPlus, Edit3, Trash2, X } from 'lucide-react';
import { gsap } from 'gsap';
import * as XLSX from 'xlsx';
import axios from 'axios';

const FacultyAttendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "" });
  const currentYear = 2026;
  // Component ke andar state ko empty array se initialize karein
// const [students, setStudents] = useState([]);
// 1. Pehle students state ko empty array se initialize karein (taaki error na aaye)
const [loading, setLoading] = useState(true);
  const months = [
    { name: "January", days: 31 }, { name: "February", days: 28 },
    { name: "March", days: 31 }, { name: "April", days: 30 },
    { name: "May", days: 31 }, { name: "June", days: 30 },
    { name: "July", days: 31 }, { name: "August", days: 31 },
    { name: "September", days: 30 }, { name: "October", days: 31 },
    { name: "November", days: 30 }, { name: "December", days: 31 },
  ];

  // --- Data Management ---
  const [students, setStudents] = useState(() => {
    const savedData = localStorage.getItem('smart_campus_attendance');
    return savedData ? JSON.parse(savedData) : [
      { id: "2304110053", name: "Krish", attendance: {} },
    ];
  }); 

  


// 2. Sirf itna useEffect use karein
useEffect(() => {
  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Backend se student list fetch karna
      const res = await axios.get('http://localhost:3000/api/auth/students'); 
      
      // Data ko proper format mein convert karna
      const formattedData = res.data.map(user => ({
        id: user.universityId || "N/A", // user model se universityId lena
        name: user.name,
        attendance: {} // Initial attendance empty rakhein (Frontend handle karega)
      }));
      
      setStudents(formattedData);
    } catch (err) {
      console.error("Data load karne mein error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, []); // [] ka matlab: Yeh sirf tab chalega jab page pehli baar load hoga

  // --- Add / Update Student Logic ---
  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
    } else {
      setStudents(prev => [...prev, { ...formData, attendance: {} }]);
    }
    closeModal();
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      closeModal();
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ id: student.id, name: student.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ id: "", name: "" });
  };

  const downloadXLS = () => {
    const reportData = students.map(s => {
      const present = Object.values(s.attendance[selectedMonth] || {}).filter(v => v).length;
      return { 
        "ID": s.id, 
        "Name": s.name, 
        "Total Days": months[selectedMonth].days, 
        "Present": present 
      };
    });
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Report_${months[selectedMonth].name}.xlsx`);
  };

  const toggleAttendance = async (studentId, day) => {
  // Current status check karo checkbox se
  const student = students.find(s => s.id === studentId);
  const isCurrentlyPresent = !!student.attendance[selectedMonth]?.[day];
  const newStatus = isCurrentlyPresent ? "Absent" : "Present";

  try {
    // 1. API call to update Backend
    await axios.post('http://localhost:3000/api/attendance/toggle', {
      universityId: studentId,
      day: day,
      month: selectedMonth,
      year: 2026,
      status: newStatus
    });

    // 2. UI Update (Success hone par state update)
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newAttendance = { ...s.attendance };
        if (!newAttendance[selectedMonth]) newAttendance[selectedMonth] = {};
        newAttendance[selectedMonth][day] = !isCurrentlyPresent;
        return { ...s, attendance: newAttendance };
      }
      return s;
    }));
  } catch (err) {
    console.error("Attendance update failed", err);
    alert("System down: Attendance save nahi ho saki!");
  }
};

  // Filter Logic
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.includes(searchTerm)
  );

  return (
    <div className="space-y-8 p-6 md:p-10 bg-[#020617] min-h-screen text-slate-200 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            {months[selectedMonth].name} <span className="text-emerald-500 underline">Control</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2">ADMIN PANEL v4.0</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-blue-900/20">
            <UserPlus size={18}/> ADD STUDENT
          </button>
          <button onClick={downloadXLS} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-lg">
            <Download size={18}/> EXCEL
          </button>
          <div className="bg-slate-900 border border-white/10 rounded-2xl px-4 flex items-center">
            <CalendarIcon size={16} className="text-emerald-500 mr-2"/>
            <select className="bg-transparent text-xs font-black py-3 outline-none cursor-pointer" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {months.map((m, i) => <option key={i} value={i} className="bg-slate-900 text-white">{m.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* --- SEARCH BAR SECTION --- */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Search by Name or Enrollment ID..."
          className="w-full bg-[#0a0f1c] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-[#0a0f1c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="sticky left-0 z-30 bg-[#0a0f1c] px-8 py-8 text-[11px] font-black uppercase text-slate-400 min-w-[200px]">Student (Click to Edit)</th>
                {Array.from({ length: months[selectedMonth].days }, (_, i) => (
                  <th key={i} className={`px-2 py-4 text-center border-l border-white/5 min-w-[45px] ${new Date(currentYear, selectedMonth, i+1).getDay() === 0 ? 'bg-rose-500/10' : ''}`}>
                    <div className={`text-sm font-black ${new Date(currentYear, selectedMonth, i+1).getDay() === 0 ? 'text-rose-500' : 'text-slate-300'}`}>{i+1}</div>
                  </th>
                ))}
                <th className="px-6 py-8 text-[10px] font-black uppercase text-blue-400 text-center bg-blue-500/5 border-l border-white/5">Total</th>
                <th className="px-6 py-8 text-[10px] font-black uppercase text-emerald-400 text-center bg-emerald-500/5 border-l border-white/5">Pres</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const presentCount = Object.values(student.attendance[selectedMonth] || {}).filter(v => v).length;
                  return (
                    <tr key={student.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all">
                      <td 
                        onClick={() => openEditModal(student)}
                        className="sticky left-0 z-20 bg-[#0a0f1c] px-8 py-5 shadow-2xl cursor-pointer hover:bg-slate-800 transition-colors group"
                      >
                          <div className="text-emerald-500 font-black text-[10px] uppercase mb-1 flex items-center gap-2">
                            {student.id} <Edit3 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                          </div>
                          <div className="text-white font-bold text-sm truncate w-32">{student.name}</div>
                      </td>
                      {Array.from({ length: months[selectedMonth].days }, (_, i) => (
                        <td key={i} className="px-1 py-5 border-l border-white/[0.02] text-center">
                          <input 
                            type="checkbox" 
                            disabled={new Date(currentYear, selectedMonth, i+1).getDay() === 0} 
                            checked={!!student.attendance[selectedMonth]?.[i+1]} 
                            onChange={() => toggleAttendance(student.id, i+1)}
                            className="w-4 h-4 rounded-md accent-emerald-500 cursor-pointer" 
                          />
                        </td>
                      ))}
                      <td className="px-6 py-5 text-center bg-blue-500/5 font-black text-blue-400 border-l border-white/5">
                        {months[selectedMonth].days}
                      </td>
                      <td className="px-6 py-5 text-center bg-emerald-500/5 font-black text-emerald-500 border-l border-white/5">
                        {presentCount}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={months[selectedMonth].days + 3} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                    No students found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{editingStudent ? "EDIT STUDENT" : "ADD NEW STUDENT"}</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-white"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Enrollment Number</label>
                <input 
                  required
                  disabled={!!editingStudent}
                  className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Full Name</label>
                <input 
                  required
                  className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all">
                  {editingStudent ? "UPDATE DETAILS" : "REGISTER STUDENT"}
                </button>
                {editingStudent && (
                  <button 
                    type="button" 
                    onClick={() => handleDeleteStudent(editingStudent.id)}
                    className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black py-4 rounded-xl transition-all border border-rose-500/20"
                  >
                    <div className="flex items-center justify-center gap-2"><Trash2 size={18}/> DELETE STUDENT</div>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance; 
