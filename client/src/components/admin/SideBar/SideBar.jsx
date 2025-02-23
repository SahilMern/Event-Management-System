import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SideBar = () => {
  const location = useLocation(); // Get current route location
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // State for sidebar visibility

  // Array of sidebar links
  const links = [
    {
      path: "/admin/users",
      name: "Users",
      icon: <FaUsers className="mr-3" />,
    },
    {
      path: "/admin/events",
      name: "Events",
      icon: <FaCalendarAlt className="mr-3" />,
    },
    {
      path: "/admin/settings",
      name: "Settings",
      icon: <FaCog className="mr-3" />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <FaSignOutAlt className="mr-3" />,
    },
  ];

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-lg md:hidden z-50"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 flex-shrink-0 fixed h-screen transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`} // z-40 to ensure sidebar is above overlay
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center p-4 hover:bg-gray-700 transition duration-300 ${
                location.pathname === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;