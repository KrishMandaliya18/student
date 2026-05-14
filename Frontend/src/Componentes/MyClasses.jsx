import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Trash2, Edit2, Mail, X, UserPlus, ShieldCheck, Key
} from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_URL = "http://localhost:5173"; 
const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"]
});

const MyClasses = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ _id: null, name: '', email: '', password: '', universityId: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    const userInfo = sessionStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;
    
    if (!token || token === "null") {
      console.error("TOKEN MISSING: Please login again.");
      return;
    }

    try {
      const res = await axios.get('/api/auth/all-students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchedData = res.data.data || res.data;
      setStudents(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      toast.error("Failed to load students data");
    }
  };

  useEffect(() => {
    fetchStudents();
    socket.on('statusChanged', (data) => {
      setStudents((prevStudents) => 
        prevStudents.map((s) => 
          s._id === data.userId ? { ...s, isLoggedIn: data.isLoggedIn } : s
        )
      );
    });
    return () => {
      socket.off('statusChanged');
    };
  }, []);

  const handleOpenModal = (student = null) => {
    if (student) {
      setFormData({ 
        _id: student._id, 
        name: student.name, 
        email: student.email, 
        password: '',
        universityId: student.universityId || student.enrollmentNumber
      });
    } else {
      setFormData({ _id: null, name: '', email: '', password: '', universityId: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const token = userInfo?.token;

    if (!token) {
      toast.error("Session expired, please login again.");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      return toast.warn("Password must be at least 6 characters!");
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (formData._id) {
        await axios.put(`/api/auth/update-student/${formData._id}`, {
          name: formData.name,
          universityId: formData.universityId,
          email: formData.email,
          password: formData.password.trim() === "" ? null : formData.password 
        }, config);
        toast.success("Student updated successfully!");
      } else {
        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student',
          enrollmentNumber: formData.universityId
        };
        await axios.post('/api/auth/signup', signupData, config);
        toast.success("New student enrolled!");
      }

      fetchStudents();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const confirmDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="p-1">
          <p className="text-xs font-black uppercase tracking-widest mb-3">Delete this record permanently?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                executeDelete(id);
                closeToast();
              }}
              className="bg-red-600 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500 transition-all"
            >
              Yes, Delete
            </button>
            <button 
              onClick={closeToast}
              className="bg-slate-700 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "dark"
      }
    );
  };

  const executeDelete = async (id) => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const token = userInfo?.token;

      await axios.delete(`/api/auth/delete-student/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents((prev) => prev.filter((student) => student._id !== id));
      toast.info("Student erased from database");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // --- UPDATED SORTING LOGIC ---
  const filteredStudents = students
    .filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.universityId || s.enrollmentNumber)?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const idA = (a.universityId || a.enrollmentNumber || "").toString();
      const idB = (b.universityId || b.enrollmentNumber || "").toString();
      return idA.localeCompare(idB, undefined, { numeric: true });
    });

  return (
    <div className="p-4 md:p-10 bg-[#0a0c10] text-white min-h-screen font-sans">
      <ToastContainer position="bottom-right" theme="dark" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={32}/>
            Admin <span className="text-emerald-500">Console</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">System Control • APR 2026</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 shrink-0"
          >
            <UserPlus size={18} /> New Enroll
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Enrollment ID</th>
              <th className="px-8 py-5">Student Details</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredStudents.map((s) => (
              <tr key={s._id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                <td className="px-8 py-6 font-mono text-emerald-400 font-bold">
                  {s.universityId || s.enrollmentNumber}
                </td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-200">{s.name}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1 mt-1"><Mail size={12}/> {s.email}</div>
                </td>
                <td className="px-8 py-6">
                  {s.isLoggedIn === true ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                      Active Student
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(s)} className="p-2 hover:text-emerald-400 transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => confirmDelete(s._id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest italic">No Records Found</div>
        )}
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1218] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X/></button>
            <h3 className="text-2xl font-black uppercase italic mb-8">
              {formData._id ? 'Update' : 'New'} <span className="text-emerald-500">Student</span>
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Full Name</label>
                <input required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:ring-1 ring-emerald-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Email</label>
                <input type="email" required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:ring-1 ring-emerald-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">University ID</label>
                  <input required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:ring-1 ring-emerald-500 outline-none"
                    value={formData.universityId} onChange={(e) => setFormData({...formData, universityId: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Password</label>
                  <input required={!formData._id} placeholder={formData._id ? "Optional" : "Required"} className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:ring-1 ring-emerald-500 outline-none"
                    type="password"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all mt-4">
                {formData._id ? 'Save Changes' : 'Confirm Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;