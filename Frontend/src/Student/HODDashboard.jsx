// import React from 'react';
// import { HiOutlineChartBar, HiOutlineUsers, HiOutlineCheckCircle, HiOutlineSpeakerphone, HiOutlineCalendar } from 'react-icons/hi';

// const HODDashboard = () => {
//   const navLinks = [
//     { name: 'Analytics', icon: <HiOutlineChartBar />, path: '#' },
//     { name: 'Manage Faculty', icon: <HiOutlineUsers />, path: '#' },
//     { name: 'Approvals', icon: <HiOutlineCheckCircle />, path: '#' },
//     { name: 'Schedules', icon: <HiOutlineCalendar />, path: '#' },
//     { name: 'Department News', icon: <HiOutlineSpeakerphone />, path: '#' },
//   ];

//   return (
//     <div className="flex bg-gray-50 min-h-screen font-sans">
//       {/* Sidebar */}
//       <div className="w-64 bg-slate-800 text-white p-6 flex flex-col fixed h-full">
//         <h2 className="text-2xl font-extrabold mb-8 text-cyan-400">HOD Panel</h2>
//         <nav className="flex-1">
//           {navLinks.map((link, index) => (
//             <div key={index} className="flex items-center gap-4 p-3 mb-3 hover:bg-slate-700 rounded-lg cursor-pointer transition-all">
//               <span className="text-xl text-cyan-300">{link.icon}</span>
//               <span className="font-medium">{link.name}</span>
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 ml-64 p-10">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Welcome, HOD (Computer Science)</h1>
//             <p className="text-sm text-slate-500">Monitoring Campus Activities</p>
//           </div>
//           <div className="flex items-center gap-4">
//              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-cyan-600">Report PDF</button>
//              <div className="w-12 h-12 bg-slate-200 rounded-full border-2 border-cyan-400"></div>
//           </div>
//         </div>

//         {/* Overview Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//           <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-t-4 border-blue-500">
//             <h4 className="text-gray-400 text-sm font-bold uppercase">Total Faculty</h4>
//             <p className="text-3xl font-black text-slate-800 mt-1">24</p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-t-4 border-purple-500">
//             <h4 className="text-gray-400 text-sm font-bold uppercase">Total Students</h4>
//             <p className="text-3xl font-black text-slate-800 mt-1">450</p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-t-4 border-yellow-500">
//             <h4 className="text-gray-400 text-sm font-bold uppercase">Pending Leaves</h4>
//             <p className="text-3xl font-black text-slate-800 mt-1">08</p>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-t-4 border-green-500">
//             <h4 className="text-gray-400 text-sm font-bold uppercase">Avg. Attendance</h4>
//             <p className="text-3xl font-black text-slate-800 mt-1">78%</p>
//           </div>
//         </div>

//         {/* Approval Section Table */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//           <h3 className="text-lg font-bold mb-4 text-slate-800">Pending Approvals</h3>
//           <div className="border-t pt-4">
//              <div className="flex justify-between items-center py-2 border-b">
//                 <span>Krish (Student) - Sick Leave</span>
//                 <div className="flex gap-2">
//                    <button className="text-green-500 font-bold px-3 py-1 border border-green-500 rounded hover:bg-green-50">Approve</button>
//                    <button className="text-red-500 font-bold px-3 py-1 border border-red-500 rounded hover:bg-red-50">Reject</button>
//                 </div>
//              </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HODDashboard;