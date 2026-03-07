import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/Login";
import Signup from "./assets/Signup";
import { useEffect } from "react";

// Common Layout & Student Pages
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import Exams from "./pages/Exams";
// import Fees from "./pages/Fees";
import NoticeBoard from "./pages/NoticeBoard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Faculty Components (Naye components jo humne banaye)
import FacultyLayout from "./Componentes/FacultyLayout";
import MyClasses from "./Componentes/MyClasses";
import UploadNotes from "./Componentes/UploadNotes";
import Announcements from "./Componentes/Announcements";
import Notifications from "./Componentes/Notifications";
import FacultySettings from "./Componentes/FacultySettings";
import FacultyAttendance from "./Componentes/FacultyAttendance"; // Faculty Attendance Component


function App() {

 useEffect(() => {
  const handleTabClose = () => {
    const storedInfo = sessionStorage.getItem("userInfo");
    if (storedInfo) {
      const userData = JSON.parse(storedInfo);
      const url = "http://localhost:3000/api/auth/force-logout";
      

      const heartbeat = setInterval(() => {
        axios.post("http://localhost:3000/api/auth/heartbeat", { userId: userInfo.id })
             .catch(e => console.log("Heartbeat failed"));
    }, 300000);
      // Ye method browser close hote waqt bhi request bhej deta hai
      const blob = new Blob([JSON.stringify({ userId: userData.id })], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    }
  };

  window.addEventListener('beforeunload', handleTabClose);
  return () => window.removeEventListener('beforeunload', handleTabClose);
}, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 1. Student Dashboard */}
      <Route path="/overview/studentdashboard" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="exams" element={<Exams />} />
        {/* <Route path="fees" element={<Fees />} /> */}
        <Route path="notice" element={<NoticeBoard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
        
      {/* 2. Faculty Dashboard (Nested Routing Setup) */}
      <Route path="/overview/admindashboard" element={<FacultyLayout />}>
        <Route index element={<Navigate to="admin" replace />} />
        <Route path="admin" element={<MyClasses />} />
        <Route path="attendance" element={<FacultyAttendance />} /> 
        <Route path="materials" element={<UploadNotes />} />
        <Route path="notice" element={<Announcements />} />
        <Route path="notifications" element={<Notifications />} />
        
        <Route path="settings" element={<FacultySettings />} />
      </Route>

    </Routes>
  );
}

export default App;