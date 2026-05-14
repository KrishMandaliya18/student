import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar as CalendarIcon, ChevronDown, Activity } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('');

const Attendance = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let m = 0; m <= currentMonth; m++) {
      const date = new Date(currentYear, m, 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      options.push(`${monthName} ${currentYear}`);
    }
    return options.reverse();
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(sessionStorage.getItem('userInfo'));
        const currentUniversityId = userData?.universityId;

        if (currentUniversityId) {
          const res = await axios.get(`/api/attendance/${currentUniversityId}`);
          
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const currentUIIndex = monthNames.indexOf(selectedMonth.split(' ')[0]);
          const currentYear = parseInt(selectedMonth.split(' ')[1]);

          // UPDATE: Sirf wahi data rakho jo Present ya Absent ho
          const filteredData = res.data.data
            .filter(log => 
              log.month === currentUIIndex && 
              log.year === currentYear && 
              (log.status === "Present" || log.status === "Absent") // Status check added
            )
            .map(log => ({ ...log, method: "System Record" }))
            .sort((a, b) => b.day - a.day);

          setAttendanceLogs(filteredData);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedMonth]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userInfo'));
    const currentUniversityId = userData?.universityId;

    if (currentUniversityId) {
      const eventName = `attendanceUpdate_${currentUniversityId}`;
      socket.on(eventName, (data) => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentUIIndex = monthNames.indexOf(selectedMonth.split(' ')[0]);
        const currentYear = parseInt(selectedMonth.split(' ')[1]);

        if (parseInt(data.month) === currentUIIndex && parseInt(data.year) === currentYear) {
          setAttendanceLogs((prevLogs) => {
            // UPDATE: Agar naya status Present/Absent nahi hai, toh purani entry delete kar do
            if (data.status !== "Present" && data.status !== "Absent") {
                return prevLogs.filter(log => log.day !== parseInt(data.day));
            }

            const existingIndex = prevLogs.findIndex(log => log.day === parseInt(data.day));
            if (existingIndex > -1) {
              const updatedLogs = [...prevLogs];
              updatedLogs[existingIndex] = { ...updatedLogs[existingIndex], status: data.status };
              return updatedLogs;
            } else {
              return [{ ...data, method: "Live Update" }, ...prevLogs].sort((a, b) => b.day - a.day);
            }
          });
        }
      });
    }
    return () => socket.off(`attendanceUpdate_${currentUniversityId}`);
  }, [selectedMonth]);

  const stats = useMemo(() => {
    const present = attendanceLogs.filter(l => l.status === "Present").length;
    const absent = attendanceLogs.filter(l => l.status === "Absent").length;
    const total = present + absent;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";
    
    return {
      present,
      absent,
      total,
      percentage,
      isGreen: parseFloat(percentage) >= 75
    };
  }, [attendanceLogs]);

  return (
    <div className="bg-[#0b1120] min-h-screen p-4 md:p-8 text-slate-200 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Attendance Dashboard</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm font-medium">
              <Activity size={16} className={stats.isGreen ? "text-green-400" : "text-red-400"} /> 
              Current Month Performance
            </p>
          </div>

          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#1e293b] border border-slate-700 text-sm rounded-xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer text-white font-semibold shadow-xl w-full md:w-auto"
            >
              {monthOptions.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-800 shadow-lg">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-700" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className={stats.isGreen ? "stroke-green-500" : "stroke-red-500"} 
                  strokeWidth="3" 
                  strokeDasharray={`${stats.percentage}, 100`} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className={`absolute inset-0 flex flex-col items-center justify-center font-black ${stats.isGreen ? 'text-green-400' : 'text-red-400'}`}>
                <span className="text-xl">{stats.percentage}%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Month Efficiency</p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-center">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle size={28}/></div>
                <div>
                   <h3 className="text-3xl font-bold text-white">{stats.present}</h3>
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Present</p>
                </div>
             </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-center">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><XCircle size={28}/></div>
                <div>
                   <h3 className="text-3xl font-bold text-white">{stats.absent}</h3>
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Absent</p>
                </div>
             </div>
          </div>
        </div>

        {/* Monthly Logs Table */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 bg-[#243147]/50 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Attendance Logs for {selectedMonth.split(' ')[0]}</h3>
            <div className="hidden md:block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 uppercase font-bold">
               {stats.total} Records Tracked
            </div>
          </div>

          <div className="overflow-x-auto">
            {attendanceLogs.length > 0 ? (
              <table className="w-full text-left">
                <thead className="text-slate-500 text-xs uppercase bg-slate-900/30">
                  <tr>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {attendanceLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-4 text-sm text-slate-300">
                        {log.day} {selectedMonth}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold ${log.status === 'Present' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Present' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500 text-right">{log.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-500 italic uppercase font-bold tracking-widest">
                No active records found for this period.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;