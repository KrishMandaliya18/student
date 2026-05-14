import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Calendar, Upload, CheckCircle2, Clock, X, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [file, setFile] = useState(null);

// Ye pure project ke liye ek baar set kar do
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
  const fetchData = async () => {
    try {
      setLoading(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
      const [feesRes, paymentsRes] = await Promise.all([
        axios.get("/api/fees/all"),
        axios.get("/api/fees/my-payments")
      ]);
      setFees(feesRes.data);
      setMyPayments(paymentsRes.data);
    } catch (err) {
      toast.error("FAILED TO LOAD FEE DATA");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("SELECT A SCREENSHOT");
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post(`/api/fees/pay/${selectedFee._id}`, formData);
      toast.success("PAYMENT SUBMITTED FOR VERIFICATION");
      setSelectedFee(null);
      setFile(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || "UPLOAD FAILED");
    } finally {
      setUploading(false);
    }
  };

  const getPaymentStatus = (feeId) => {
    const payment = myPayments.find(p => p.feeId?._id === feeId);
    if (!payment) return null;
    return payment;
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-500 animate-pulse tracking-widest">SYNCHRONIZING FINANCIAL DATA...</div>;

  return (
    <div className="max-w-6xl space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Fee Management Portal
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Track and pay your academic dues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fees.map((fee) => {
          const payment = getPaymentStatus(fee._id);
          const isPaid = payment?.status === 'paid';
          const isPending = payment?.status === 'pending';

          return (
            <motion.div 
              key={fee._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#0f172a]/60 p-8 rounded-[2.5rem] border ${isPaid ? 'border-emerald-500/20' : 'border-white/5'} shadow-2xl relative overflow-hidden group`}
            >
              {isPaid && (
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{fee.description || 'ACADEMIC FEE'}</span>
                  <h3 className="text-xl font-bold text-white mt-1 leading-tight">{fee.title}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₹{fee.amount}</span>
                  <span className="text-[10px] text-slate-500 font-bold">TOTAL AMOUNT</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                  <Calendar size={14} className="text-rose-500"/> DUE DATE: {new Date(fee.dueDate).toLocaleDateString()}
                </div>

                {isPaid ? (
                  <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle2 size={16}/> PAYMENT VERIFIED
                  </div>
                ) : isPending ? (
                  <div className="w-full py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                    <Clock size={16}/> VERIFICATION PENDING
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedFee(fee)}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <IndianRupee size={16}/> PAY NOW
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
        {fees.length === 0 && (
          <div className="col-span-full bg-slate-900/50 p-20 rounded-[2.5rem] border border-dashed border-white/10 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-black text-xs uppercase tracking-widest italic opacity-40">No pending fee requirements found</p>
          </div>
        )}
      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {selectedFee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative"
            >
               <button 
                 onClick={() => setSelectedFee(null)}
                 className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all"
               >
                 <X size={24} />
               </button>

               <div className="space-y-8">
                 <div>
                    <h3 className="text-2xl font-black text-white leading-tight">Pay {selectedFee.title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                       <IndianRupee size={12} className="text-blue-500"/> Amount: ₹{selectedFee.amount}
                    </p>
                 </div>

                 <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-blue-500 shrink-0" size={20} />
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                       Please pay using any UPI app (PhonePe, Google Pay, etc.) and upload a screenshot of the successful transaction. Our administrators will verify and update your status within 24 hours.
                    </p>
                 </div>

                 <form onSubmit={handleUpload} className="space-y-6">
                    <div className="relative group/upload">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-white/10 group-hover/upload:border-blue-500/50 group-hover/upload:bg-blue-500/5 p-10 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all">
                        <Upload size={32} className="text-slate-500 group-hover/upload:text-blue-400 group-hover/upload:animate-bounce" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/upload:text-blue-400">
                          {file ? file.name : "Select Transaction Screenshot"}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={uploading}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploading ? "TRANSMITTING DATA..." : "SUBMIT PROOF OF PAYMENT"} <FileText size={16}/>
                    </button>
                 </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Fees;
