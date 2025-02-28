import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { logout } from "../../../../redux/slice/AuthSlice";
import { logoutApi } from "../../../helper/backend/backend";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${logoutApi}`, {}, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log(response.data.message);
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white  w-full z-10 top-0 left-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/event.png" alt="Event Logo" className="h-8 w-8" />
            <span className="text-xl sm:text-2xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300 ">
              Event
            </span>
          </Link>

          {/* Desktop Menu */}
          {
            user &&    <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium"
            >
              Contact Us
            </Link>
          </div>
          }
       

          {/* User Actions (Visible on md and larger screens) */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-800 hover:text-blue-600 transition duration-300 text-lg font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2   rounded-lg text-black transition duration-300 text-lg font-medium hover:underline hover:text-blue-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300 text-lg font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <Link
              to="/"
              className="block text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium py-2"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/about"
              className="block text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium py-2"
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="block text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium py-2"
              onClick={toggleMobileMenu}
            >
              Contact Us
            </Link>

            {/* Show Dashboard and Logout in Mobile Menu */}
            {user && (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block text-gray-800 hover:text-blue-600 transition duration-300 text-lg uppercase font-medium py-2"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                 className="cursor-pointer bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;