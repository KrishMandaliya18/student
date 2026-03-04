import React from 'react';
import { Bell, MessageSquare, AlertCircle, Clock, Check } from 'lucide-react';

const Notifications = () => {
  const alerts = [
    { id: 1, type: 'assignment', title: 'New Submission', desc: 'Rahul submitted React Hooks Assignment', time: '5m ago', unread: true },
    { id: 2, type: 'system', title: 'System Update', desc: 'Faculty portal will be down for maintenance at 12 AM', time: '2h ago', unread: true },
    { id: 3, type: 'message', title: 'Principal Message', desc: 'Meeting scheduled for NAAC accreditation', time: '1d ago', unread: false },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black text-white">Notifications</h3>
        <button className="text-xs font-bold text-emerald-400 hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-6 rounded-[2rem] border transition-all ${alert.unread ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#0f172a]/60 border-white/5 opacity-70'}`}>
            <div className="flex gap-5">
              <div className={`p-3 rounded-2xl h-fit ${alert.unread ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {alert.type === 'assignment' ? <Check size={20}/> : alert.type === 'system' ? <AlertCircle size={20}/> : <MessageSquare size={20}/>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold uppercase"><Clock size={12}/> {alert.time}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{alert.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;