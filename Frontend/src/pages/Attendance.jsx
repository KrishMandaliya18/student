import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
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

          const currentUIIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(selectedMonth.split(' ')[0]);
          const currentYear = parseInt(selectedMonth.split(' ')[1]);

          const filteredData = res.data.data
            .filter(log => log.month === currentUIIndex && log.year === currentYear)
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

        const currentUIIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(selectedMonth.split(' ')[0]);
        const currentYear = parseInt(selectedMonth.split(' ')[1]);

        if (parseInt(data.month) !== currentUIIndex || parseInt(data.year) !== currentYear) return;

        setAttendanceLogs((prevLogs) => {
          const existingIndex = prevLogs.findIndex(log => log.day === parseInt(data.day));
          const updatedLogs = [...prevLogs];
          if (existingIndex > -1) {
            updatedLogs[existingIndex] = { ...updatedLogs[existingIndex], status: data.status };
            return updatedLogs;
          } else {
            return [{ ...data, method: "Live Update" }, ...prevLogs].sort((a, b) => b.day - a.day);
          }
        });
      });
    }
    return () => socket.off(`attendanceUpdate_${currentUniversityId}`);
  }, [selectedMonth]);

  const presentCount = attendanceLogs.filter(l => l.status === "Present").length;
  const absentCount = attendanceLogs.filter(l => l.status === "Absent").length;
  const totalTracked = attendanceLogs.length;
  const percentage = totalTracked > 0 ? ((presentCount / totalTracked) * 100).toFixed(1) : "0.0";
  const totalLectures = 30;

  const StatBox = ({ icon, value, label, subValue }) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 transition-all group">
      <div className="mb-4 p-2 bg-slate-800/50 w-fit rounded-lg group-hover:bg-blue-500/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-white leading-none tracking-tight">
        {value}
        {subValue && <span className="text-slate-500 text-lg font-normal"> {subValue}</span>}
      </h3>
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-3">{label}</p>
    </div>
  );

  return (
    <div className="bg-[#0b1120] min-h-screen p-4 md:p-8 text-slate-200 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Attendance Dashboard</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm font-medium">
              <CalendarIcon size={16} className="text-blue-400" /> Real-time Academic Tracker
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-800 shadow-lg">
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-700" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="3.5" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white">{percentage}%</div>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">Attendance %</p>
          </div>

          <StatBox icon={<CheckCircle size={22} className="text-green-500" />} value={presentCount} label="Days Present" />
          <StatBox icon={<XCircle size={22} className="text-red-500" />} value={absentCount} label="Days Absent" />
          <StatBox icon={<Clock size={22} className="text-blue-400" />} value={totalTracked} subValue={`/ ${totalLectures}`} label="Lectures Tracked" />
        </div>

        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 bg-[#243147]/50 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Monthly Logs</h3>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 uppercase font-bold animate-pulse">
              ● Live Updating
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
                          {log.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500 text-right">{log.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-500">No records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
