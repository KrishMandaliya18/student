import React, { useState, useEffect } from 'react';
import { IndianRupee, Calendar, Send, CheckCircle, Clock, Eye, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', dueDate: '', description: '' });
  const [viewingScreenshot, setViewingScreenshot] = useState(null);
// axios.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('token'); // Check if it's session or local
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
  const fetchFees = async () => {
    try {
      const res = await axios.get("/api/fees/all");
      setFees(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/fees/admin/payments");
      setPayments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchFees();
    fetchPayments();
  }, []);

  const handleCreateFee = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.dueDate) return;
    try {
      setLoading(true);
      await axios.post("/api/fees/add", formData);
      toast.success("FEE CREATED SUCCESSFULLY");
      setFormData({ title: '', amount: '', dueDate: '', description: '' });
      fetchFees();
    } catch (err) {
      toast.error("FAILED TO CREATE FEE");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId) => {
    try {
      await axios.put(`/api/fees/verify/${paymentId}`);
      toast.success("PAYMENT VERIFIED");
      fetchPayments();
    } catch (err) {
      toast.error("VERIFICATION FAILED");
    }
  };

  return (
    <div className="max-w-6xl space-y-8 pb-20">
      {/* 1. Create Fee Section */}
      <div className="bg-[#0f172a]/60 p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl backdrop-blur-md">
        <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
          <IndianRupee size={20} className="text-blue-500" /> Create New Fee Structure
        </h3>
        <form onSubmit={handleCreateFee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Fee Title (e.g. Semester 2 Examination)" 
              className="w-full bg-slate-900/80 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="Amount (Rs.)" 
              className="w-full bg-slate-900/80 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div className="space-y-4">
            <input 
              type="date" 
              className="w-full bg-slate-900/80 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              required
            />
            <textarea 
              placeholder="Description (Optional)" 
              className="w-full bg-slate-900/80 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all h-[54px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/40"
            >
              {loading ? "INITIALIZING..." : "PUBLISH FEE STRUCTURE"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Payment Tracker Section */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] px-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div> Execution Tracker: Student Payments
        </h4>
        
        <div className="bg-[#0a0f1c] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5">
                <th className="p-6">Student</th>
                <th className="p-6">Fee Details</th>
                <th className="p-6">Submission Date</th>
                <th className="p-6">Status</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{p.studentId?.name || "Unknown"}</span>
                      <span className="text-[10px] text-slate-500 font-black tracking-tighter">{p.studentId?.universityId || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-medium">{p.feeId?.title}</span>
                      <span className="text-blue-400 font-black text-xs">₹{p.feeId?.amount}</span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 font-medium">
                    <div className="flex items-center gap-2"><Calendar size={14}/> {new Date(p.paidAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-6">
                    {p.status === 'paid' ? (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                        <CheckCircle size={10}/> VERIFIED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                        <Clock size={10}/> PENDING
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setViewingScreenshot(p.screenshotPath)}
                        className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-blue-400 transition-all tooltip"
                      >
                        <Eye size={16} />
                      </button>
                      {p.status === 'pending' && (
                        <button 
                          onClick={() => handleVerify(p._id)}
                          className="px-3 py-1 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest italic opacity-30 text-xs">
                    No payment records found in the system
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SCREENSHOT MODAL --- */}
      {viewingScreenshot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setViewingScreenshot(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-blue-400 transition-all font-black"
            >
              <X size={32} />
            </button>
            <div className="bg-[#0f172a] p-2 rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden">
               <img 
                 src={`/${viewingScreenshot.replace(/\\/g, '/')}`} 
                 alt="Payment Screenshot" 
                 className="w-full h-auto max-h-[80vh] object-contain rounded-[1rem]"
               />
               <div className="p-4 flex justify-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Digital Payment Verification Evidence</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
