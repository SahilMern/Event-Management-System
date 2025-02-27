import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto ml-0 md:ml-64 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
