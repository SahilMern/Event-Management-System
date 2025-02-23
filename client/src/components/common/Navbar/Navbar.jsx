import { Link } from "react-router-dom";
import { FaUser, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/slice/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux

  const handleLogout = () => {
    dispatch(logout()); // Logout the user
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
            Event
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {user && (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-500 transition duration-300">
                  Home
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-500 transition duration-300 flex items-center"
                  >
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </Link>
                )}
              </>
            )}
            <Link to="/about" className="text-gray-700 hover:text-blue-500 transition duration-300">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-500 transition duration-300">
              Contact Us
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-l-lg hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  <FaUser className="mr-2" /> Login
                </Link>
                <Link
                  to="/register"
                  className=" text-white px-4 py-2   transition duration-300 flex items-center rounded-full"
                >
                   Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;