import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <AdminSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <main className="flex-1 h-screen overflow-y-auto relative z-10 scrollbar-hide">
        <AdminHeader setIsOpen={setIsMobileMenuOpen} />
        <div className="p-6 lg:p-10">
          <Outlet /> {/* This renders the specific page component */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;