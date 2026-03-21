
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Trash2, Edit2, Mail, X, UserPlus, ShieldCheck, Key
} from 'lucide-react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify'; 
import { io } from 'socket.io-client';

const SOCKET_URL = "http://localhost:3000"; 
const socket = io(SOCKET_URL);
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
    const res = await axios.get('http://localhost:3000/api/auth/all-students', {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    setStudents(res.data.data || res.data);
    
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    if (err.response?.status === 401) {
       console.error("Session expired. Please login again.");
    }
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

    return () => socket.off('statusChanged');
  
  }, []);

  
  const handleOpenModal = (student = null) => {
    if (student) {
      setFormData({ 
        _id: student._id, 
        name: student.name, 
        email: student.email, 
        password:'' ,
        universityId: student.universityId 
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
        return toast.warn("Password 6 characters se bada hona chahiye!");
    }

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        if (formData._id) {
            await axios.put(`http://localhost:3000/api/auth/update-student/${formData._id}`, {
                name: formData.name,
                universityId: formData.universityId,
                email: formData.email,
                password: formData.password.trim() === "" ? null : formData.password 
            }, config);
            
            toast.success("Student Data Updated Successfully!");
        } else {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'student',
                enrollmentNumber: formData.universityId
            };
            await axios.post('http://localhost:3000/api/auth/signup', signupData, config);
            toast.success("New student enrolled!");
        }

        fetchStudents();
        setShowModal(false);
    } catch (err) {
        const errorMsg = err.response?.data?.message || "Operation fail ho gaya";
        toast.error(errorMsg);
    }
};

 

const deleteStudent = async (id) => {
  if (!window.confirm("ARE YOU SURE? Ye student permanently delete ho jayega aur wapas nahi aayega!")) {
    return;
  }

  try {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const token = userInfo?.token;

    await axios.delete(`http://localhost:3000/api/auth/delete-student/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setStudents((prev) => prev.filter((student) => student._id !== id));
    
    alert("STUDENT ERASED FROM DATABASE");

  } catch (error) {
    alert(error.response?.data?.message || "Delete failed");
  }
};
  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.universityId?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  
  return (
    <div className="p-4 md:p-10 bg-[#0a0c10] text-white min-h-screen font-sans">

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={32}/>
            Admin <span className="text-emerald-500">Console</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">System Control • FEB 2026</p>
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
                <td className="px-8 py-6 font-mono text-emerald-400 font-bold">{s.universityId}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-200">{s.name}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1 mt-1"><Mail size={12}/> {s.email}</div>
                </td>
               
                <td className="px-8 py-6">
  {s.isLoggedIn ? (
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
                    <button onClick={() => deleteStudent(s._id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1218] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X/></button>
            
            <h3 className="text-2xl font-black uppercase italic mb-8">
              {formData._id ? 'Update' : 'New'} <span className="text-emerald-500">Student</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Full Name</label>
                <input required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 ring-emerald-500"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Email</label>
                <input type="email" required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 ring-emerald-500"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">University ID</label>
                  <input required className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 ring-emerald-500"
                    value={formData.universityId} onChange={(e) => setFormData({...formData, universityId: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Password</label>
                  <input required={!formData._id} placeholder={formData._id ? "Optional if editing" : "Required"} className="w-full bg-slate-800/50 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 ring-emerald-500"
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