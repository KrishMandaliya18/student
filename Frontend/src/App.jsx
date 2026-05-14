import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/Login";
import Signup from "./assets/Signup";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
// import Exams from "./pages/Exams";
import NoticeBoard from "./pages/NoticeBoard";
import Settings from "./pages/Settings";
import Fees from "./pages/Fees";

 
import AdminLayout from "./Componentes/AdminLayout";
import MyClasses from "./Componentes/MyClasses";
import UploadNotes from "./Componentes/UploadNotes";
import AdminAnnouncements from "./Componentes/AdminAnnouncements";
import AdminSettings from "./Componentes/AdminSettings";
import AdminAttendance from "./Componentes/AdminAttendance"; 
import AdminFees from "./Componentes/AdminFees";


function App() {

//  useEffect(() => {
//   const handleTabClose = () => {
//     const storedInfo = sessionStorage.getItem("userInfo");
//     if (storedInfo) {
//       const userData = JSON.parse(storedInfo);
//       const url = "/api/auth/force-logout";
      

//       const heartbeat = setInterval(() => {
//         axios.post("/api/auth/heartbeat", { userId: userInfo.id })
//              .catch(e => console.log("Heartbeat failed"));
//     }, 300000);
//       // Ye method browser close hote waqt bhi request bhej deta hai
//       const blob = new Blob([JSON.stringify({ userId: userData.id })], { type: 'application/json' });
//       navigator.sendBeacon(url, blob);
//     }
//   };

//   window.addEventListener('beforeunload', handleTabClose);
//   return () => window.removeEventListener('beforeunload', handleTabClose);
// }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login forcedRole="student" />} />
      <Route path="/admin" element={<Login forcedRole="admin" />} />
      <Route path="/teacherlogin" element={<Login forcedRole="teacher" />} />
      <Route path="/hodlogin" element={<Login forcedRole="hod" />} />
      
      <Route path="/signup" element={<Signup forcedRole="student" />} />
      <Route path="/adminsignup" element={<Signup forcedRole="admin" />} />
      <Route path="/teachersignup" element={<Signup forcedRole="teacher" />} />
      <Route path="/hodsignup" element={<Signup forcedRole="hod" />} />
      
      {/* 1. Student Dashboard */}
      <Route path="/overview/studentdashboard" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        {/* <Route path="exams" element={<Exams />} /> */}
        <Route path="notice" element={<NoticeBoard />} />
        <Route path="fees" element={<Fees />} />
        <Route path="settings" element={<Settings />} />
      </Route>
        
      <Route path="/overview/teacherdashboard" element={<AdminLayout />}>
        <Route index element={<Navigate to="teacher" replace />} />
        <Route path="teacher" element={<MyClasses />} />
        <Route path="attendance" element={<AdminAttendance />} /> 
        <Route path="materials" element={<UploadNotes />} />
        <Route path="notice" element={<AdminAnnouncements ROLE="teacher" />} />        
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/overview/hoddashboard" element={<AdminLayout />}>
        <Route index element={<Navigate to="hod" replace />} />
        <Route path="hod" element={<MyClasses />} />
        <Route path="attendance" element={<AdminAttendance />} /> 
        <Route path="materials" element={<UploadNotes />} />
        <Route path="notice" element={<AdminAnnouncements ROLE="hod" />} />        
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/overview/admindashboard" element={<AdminLayout />}>
        <Route index element={<Navigate to="admin" replace />} />
        <Route path="admin" element={<MyClasses />} />
        <Route path="attendance" element={<AdminAttendance />} /> 
        <Route path="materials" element={<UploadNotes />} />
        <Route path="notice" element={<AdminAnnouncements ROLE="admin" />} />        
        <Route path="fees" element={<AdminFees />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

    </Routes>
  );
}

export default App;
