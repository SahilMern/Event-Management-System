import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - 25% width */}
      <SideBar />

      {/* Main Content - 75% width */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;