import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Bot,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { gsap } from "gsap";
import axios from "axios"; // 1. Axios Import
import toast, { Toaster } from "react-hot-toast"; // 2. Toast Import

const Login = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    universityId: "",
    password: "",
    secret: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  const roles = [
    { id: "student", label: "Student" },
    { id: "admin", label: "Admin" },
  ];

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 }
    );
  }, []);
// --- Backend Integration Logic ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Frontend Basic Validation
    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("INVALID NEURAL LINK: ONLY @GMAIL.COM ALLOWED", {
        style: { background: '#1e1b4b', color: '#f87171', border: '1px solid #f87171' }
      });
      setIsLoading(false);
      return;
    }

    try {
      // API call to Backend
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: formData.email,
        password: formData.password,
        role: role,
        secretKey: role === "admin" ? formData.secret : null 
      });

      const { token, user } = response.data;

      // --- NEW LOGIC: Ek unified object banayein ---
      const userData = {
        id: user.id, // Backend se user ID lena zaroori hai
        token: token,
        name: user.name,
        email: user.email || formData.email, // Backend ya form se email
        role: user.role,
        universityId: user.universityId || formData.universityId || ""
      };

      // --- SAVE TO SESSIONSTORAGE ---
      // Hum 'userInfo' key use kar rahe hain kyunki FacultySettings.jsx isi ko dhoond raha hai
      sessionStorage.setItem("token", token); // Token ko alag se bhi store kar sakte hain agar zarurat ho
      sessionStorage.setItem("userInfo", JSON.stringify(userData));

      // Success Toast
      toast.success(`ACCESS GRANTED: WELCOME ${user.name.toUpperCase()}`, {
        style: { background: '#0f172a', color: '#22d3ee', border: '1px solid #22d3ee' },
        iconTheme: { primary: '#22d3ee', secondary: '#0f172a' }
      });

      // --- REDIRECT LOGIC ---
      setTimeout(() => {
        if (role === "student") {
          navigate("/overview/studentdashboard/dashboard");
        } else if (role === "admin") {
          navigate("/overview/admindashboard/admin");
        }
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.msg || "CONNECTION REFUSED: SYSTEM OFFLINE";
      toast.error(errorMessage.toUpperCase(), {
        style: { background: '#1e1b4b', color: '#f87171', border: '1px solid #f87171' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-6 overflow-hidden relative font-sans selection:bg-cyan-500">
      {/* 3. Toaster Component for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div
        ref={containerRef}
        className="w-full max-w-[1050px] grid md:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[48px] border border-white/10 overflow-hidden shadow-2xl z-10"
      >
        {/* Left Side (Smart Campus Info) */}
        <div className="hidden md:flex flex-col justify-center p-14 bg-gradient-to-br from-cyan-600/10 to-transparent">
          <div className="flex items-center gap-2 bg-cyan-500/10 w-fit px-3 py-1.5 rounded-full border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">
              AI Core Online
            </span>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 leading-none tracking-tighter uppercase italic">
            Smart<br />Campus
          </h1>
          <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed italic">
            Next-gen management system for the AI era.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-cyan-400 bg-white/5 p-4 rounded-3xl border border-white/5">
              <Bot size={24} className="animate-pulse" />
              <p className="text-gray-100 font-black text-[10px] uppercase tracking-wider">Generative AI Core</p>
            </div>
            <div className="flex items-center gap-4 text-cyan-400 bg-white/5 p-4 rounded-3xl border border-white/5">
              <ShieldCheck size={24} className="animate-pulse" />
              <p className="text-gray-100 font-black text-[10px] uppercase tracking-wider">Security Protocol 4.0</p>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="p-10 md:p-14 bg-black/40 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Login</h2>
            <Link to="/signup" className="text-cyan-400 text-[11px] font-black tracking-widest uppercase underline underline-offset-8">Register</Link>
          </div>

          {/* Role Switcher */}
          <div className="flex gap-1.5 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  setFormData({ ...formData, secret: "", universityId: "" }); // Clear fields when switching roles
                }}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                  role === r.id
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full bg-slate-800/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            {role !== "student" && (
              <input
                type="password"
                placeholder="SECRET ACCESS KEY"
                required
                className="w-full bg-red-500/5 border border-red-500/30 rounded-2xl py-4 px-6 text-red-100 focus:border-red-500 outline-none font-mono text-xs tracking-[0.3em] placeholder:tracking-normal placeholder:text-red-900"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              />
            )}

            {/* Note: Enrollment number is usually used for registration, but kept for consistency if your backend requires it for login */}
            {role === "student" && (
              <input
                type="text"
                placeholder="ENROLLMENT NUMBER"
                required
                className="w-full bg-slate-800/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-600"
                value={formData.universityId}
                onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
              />
            )}

            <input
              type="password"
              placeholder="PASSWORD"
              required
              className="w-full bg-slate-800/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 mt-8 uppercase tracking-widest transition-transform active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> AUTHORIZING...</>
              ) : (
                <>Enter Portal <ChevronRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;