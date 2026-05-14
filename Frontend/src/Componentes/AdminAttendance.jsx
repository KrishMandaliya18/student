import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  Edit3,
  X,
  CheckCircle2,
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";

const AdminAttendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "" });
  const [loading, setLoading] = useState(true);
  
  const currentYear = 2026; 

  const months = [
    { name: "January", days: 31 }, { name: "February", days: 28 },
    { name: "March", days: 31 }, { name: "April", days: 30 },
    { name: "May", days: 31 }, { name: "June", days: 30 },
    { name: "July", days: 31 }, { name: "August", days: 31 },
    { name: "September", days: 30 }, { name: "October", days: 31 },
    { name: "November", days: 30 }, { name: "December", days: 31 },
  ];

  const [students, setStudents] = useState([]);

  // --- 1. Fetch Students & Their Attendance from DB ---
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const userInfo = sessionStorage.getItem('userInfo');
      const token = userInfo ? JSON.parse(userInfo).token : null;

      // Sabhi students ko fetch karein
      const res = await axios.get("/api/auth/all-students", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const fetchedData = res.data.data || res.data;

      // Har student ki attendance detail fetch karke merge karein
      const formattedData = await Promise.all(fetchedData.map(async (user) => {
        try {
          const attRes = await axios.get(`/api/attendance/${user.universityId}`);
          const records = attRes.data.data || [];
          
          // Data format ko UI ke hisaab se convert karein
          const attendanceMap = {};
          records.forEach(rec => {
            if (!attendanceMap[rec.year]) attendanceMap[rec.year] = {};
            if (!attendanceMap[rec.year][rec.month]) attendanceMap[rec.year][rec.month] = {};
            attendanceMap[rec.year][rec.month][rec.day] = rec.status === 'Present';
          });

          return {
            id: user.universityId || "N/A",
            name: user.name,
            attendance: attendanceMap, 
          };
        } catch (e) {
          return { id: user.universityId, name: user.name, attendance: {} };
        }
      }));

      setStudents(formattedData);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const getNextStatus = (currentStatus) => {
    if (currentStatus === true) return false; // Present -> Absent
    if (currentStatus === false) return null;  // Absent -> Unmarked
    return true; // Unmarked -> Present
  };

  // --- 2. Toggle Attendance & Save to DB Permanent ---
  const toggleAttendance = async (studentId, day) => {
    const student = students.find(s => s.id === studentId);
    const currentStatus = student.attendance?.[currentYear]?.[selectedMonth]?.[day];
    const newStatusBool = getNextStatus(currentStatus);
    
    // UI Update (Optimistic)
    const updatedStudents = students.map((s) => {
      if (s.id === studentId) {
        const newAtt = { ...s.attendance };
        if (!newAtt[currentYear]) newAtt[currentYear] = {};
        if (!newAtt[currentYear][selectedMonth]) newAtt[currentYear][selectedMonth] = {};
        
        if (newStatusBool === null) {
          delete newAtt[currentYear][selectedMonth][day];
        } else {
          newAtt[currentYear][selectedMonth][day] = newStatusBool;
        }
        return { ...s, attendance: newAtt };
      }
      return s;
    });
    setStudents(updatedStudents);

    // Database Update
    if (newStatusBool !== null) {
      try {
        await axios.post("/api/attendance/toggle", {
          universityId: studentId,
          day,
          month: selectedMonth,
          year: currentYear,
          status: newStatusBool ? "Present" : "Absent"
        });
      } catch (err) {
        console.error("Failed to save attendance:", err);
        alert("Attendance save nahi ho saki. Please try again.");
        fetchStudents(); // Rollback UI if failed
      }
    }
  };

  const markAllPresent = async () => {
    const today = new Date().getDate();
    if (window.confirm(`Mark all filtered students as Present for Day ${today}?`)) {
      for (const student of filteredStudents) {
        try {
          await axios.post("/api/attendance/toggle", {
            universityId: student.id,
            day: today,
            month: selectedMonth,
            year: currentYear,
            status: "Present"
          });
        } catch (err) {
          console.error(`Error marking ${student.id}:`, err);
        }
      }
      fetchStudents(); // Refresh data after batch update
    }
  };

  const filteredStudents = students
    .filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toString().includes(searchTerm)
    )
    .sort((a, b) => a.id.toString().localeCompare(b.id.toString(), undefined, { numeric: true }));

  const handleSaveStudent = (e) => {
    e.preventDefault();
    const updatedStudents = students.map((s) => (s.id === editingStudent.id ? { ...s, ...formData } : s));
    setStudents(updatedStudents);
    setIsModalOpen(false);
  };

  const downloadXLS = () => {
    const reportData = filteredStudents.map((s) => {
      const att = s.attendance[currentYear]?.[selectedMonth] || {};
      const present = Object.values(att).filter(v => v === true).length;
      const absent = Object.values(att).filter(v => v === false).length;
      return { ID: s.id, Name: s.name, Present: present, Absent: absent };
    });
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Report_${months[selectedMonth].name}.xlsx`);
  };

  if (loading) return <div className="p-10 text-white text-center">Loading Data...</div>;

  return (
    <div className="space-y-8 p-6 md:p-10 bg-[#020617] min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            {months[selectedMonth].name} <span className="text-emerald-500 underline">Control</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2 uppercase">
            ADMIN PANEL v5.5 | SORTED BY ID
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={markAllPresent} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl text-xs font-black transition-all">
            <CheckCircle2 size={18} /> MARK ALL TODAY
          </button>
          <button onClick={downloadXLS} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-black transition-all">
            <Download size={18} /> EXCEL
          </button>
          <div className="bg-slate-900 border border-white/10 rounded-2xl px-4 flex items-center">
            <CalendarIcon size={16} className="text-emerald-500 mr-2" />
            <select
              className="bg-transparent text-xs font-black py-3 outline-none text-white cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i} className="bg-slate-900">{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full bg-[#0a0f1c] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0f1c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="sticky left-0 z-30 bg-[#0a0f1c] px-8 py-8 text-[11px] font-black uppercase text-slate-400 min-w-[220px]">Student Details</th>
                {Array.from({ length: months[selectedMonth].days }, (_, i) => (
                  <th key={i} className={`px-2 py-4 text-center border-l border-white/5 min-w-[45px] ${new Date(currentYear, selectedMonth, i + 1).getDay() === 0 ? "bg-rose-500/10" : ""}`}>
                    <div className="text-xs font-black text-slate-300">{i + 1}</div>
                  </th>
                ))}
                <th className="px-4 py-8 text-[10px] font-black uppercase text-emerald-400 text-center bg-emerald-500/5 border-l border-white/5">Pres</th>
                <th className="px-4 py-8 text-[10px] font-black uppercase text-rose-400 text-center bg-rose-500/5 border-l border-white/5">Abs</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const monthAttendance = student.attendance?.[currentYear]?.[selectedMonth] || {};
                const presentCount = Object.values(monthAttendance).filter((v) => v === true).length;
                const absentCount = Object.values(monthAttendance).filter((v) => v === false).length;
                
                return (
                  <tr key={student.id} className="border-b border-white/[0.03] group/row hover:bg-white/[0.01]">
                    <td 
                      onClick={() => { setEditingStudent(student); setFormData({ id: student.id, name: student.name }); setIsModalOpen(true); }}
                      className="sticky left-0 z-20 bg-[#0a0f1c] px-8 py-5 cursor-pointer transition-all duration-300 group/name"
                    >
                      <div className="text-emerald-500 font-black text-[10px] uppercase group-hover/name:tracking-widest transition-all">{student.id}</div>
                      <div className="text-white font-bold text-sm flex items-center gap-2 group-hover/name:text-emerald-400 group-hover/name:translate-x-1 transition-all">
                        {student.name} 
                        <Edit3 size={12} className="opacity-0 group-hover/name:opacity-100 text-emerald-500 transition-opacity" />
                      </div>
                    </td>

                    {Array.from({ length: months[selectedMonth].days }, (_, i) => {
                      const status = student.attendance?.[currentYear]?.[selectedMonth]?.[i + 1];
                      const isSunday = new Date(currentYear, selectedMonth, i + 1).getDay() === 0;

                      return (
                        <td key={i} className="px-1 py-5 border-l border-white/[0.02] text-center">
                          <button
                            disabled={isSunday}
                            onClick={() => toggleAttendance(student.id, i + 1)}
                            className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center border text-[10px] font-bold ${
                              isSunday ? "opacity-20 cursor-not-allowed" :
                              status === true ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]" :
                              status === false ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]" :
                              "bg-slate-800 border-white/10 hover:border-emerald-500/50"
                            }`}
                          >
                            {status === true ? "P" : status === false ? "A" : ""}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-5 text-center bg-emerald-500/5 font-black text-emerald-500 border-l border-white/5">{presentCount}</td>
                    <td className="px-4 py-5 text-center bg-rose-500/5 font-black text-rose-500 border-l border-white/5">{absentCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Edit <span className="text-emerald-500">Student</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
             </div>
             <form onSubmit={handleSaveStudent} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Enrollment ID</label>
                  <input required disabled className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 px-4 text-white opacity-50" value={formData.id} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Student Name</label>
                  <input required className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-emerald-500 outline-none transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-emerald-500 transition-all uppercase text-sm tracking-widest">Update Record</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;