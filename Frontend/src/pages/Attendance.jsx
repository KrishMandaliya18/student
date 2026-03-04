import React from 'react';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Attendance = () => {
  // Socho ye data Backend/Admin se aa raha hai
  // Student isse edit nahi kar sakta (Read-Only)
  const attendanceLogs = [
    { date: "2026-03-01", status: "Present", method: "Admin Panel" },
    { date: "2026-03-02", status: "Present", method: "Admin Panel" },
    { date: "2026-03-03", status: "Absent", method: "Admin Panel" },
  ];

  const totalLectures = 30;
  const presentCount = attendanceLogs.filter(l => l.status === "Present").length;
  const percentage = ((presentCount / attendanceLogs.length) * 100).toFixed(1);

  return (
    <div className="bg-[#0b1120] min-h-screen p-6 text-slate-200">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Non-Editable */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Attendance Overview</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
               <CalendarIcon size={16} /> Data synced with Admin Hub
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <span className="text-green-400 font-medium text-sm">Status: Good Standing</span>
          </div>
        </div>

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Circular Percentage (Simple Tailwind Circle) */}
          <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-700">
             <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="stroke-[#334155] stroke-[3]" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-[#10b981] stroke-[3] transition-all duration-1000" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{percentage}%</div>
             </div>
             <p className="text-xs text-slate-400">Total Attendance</p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <CheckCircle className="text-green-500 mb-2" size={24} />
            <h3 className="text-2xl font-bold">{presentCount}</h3>
            <p className="text-xs text-slate-400">Days Present</p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <XCircle className="text-red-500 mb-2" size={24} />
            <h3 className="text-2xl font-bold">{attendanceLogs.length - presentCount}</h3>
            <p className="text-xs text-slate-400">Days Absent</p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
            <Clock className="text-blue-400 mb-2" size={24} />
            <h3 className="text-2xl font-bold">{totalLectures}</h3>
            <p className="text-xs text-slate-400">Total days</p>
          </div>
        </div>

        {/* Read-Only Table */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-5 bg-[#243147] font-semibold border-b border-slate-700">
            Recent Logs (Read-Only)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1e293b] text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {attendanceLogs.map((log, i) => (
                  <tr key={i} className="text-sm">
                    <td className="px-6 py-4">{log.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md ${log.status === 'Present' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        ● {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{log.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;