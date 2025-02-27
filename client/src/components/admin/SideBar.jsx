import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";

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
  ];

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 left-4 p-2 bg-gray-800 text-white rounded-lg md:hidden z-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar - 25% width */}
      <div
        className={`bg-gray-800 text-white w-[80%] md:w-1/4 flex-shrink-0 h-screen transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed sm:fixed md:relative z-40`} // Fixed on sm, relative on md and above
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center p-4 hover:bg-gray-700 transition duration-300 ${
                location.pathname === link.path ? "bg-gray-700 font-semibold" : "text-gray-300"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className=""
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;