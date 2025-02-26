import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook
import { FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/slice/AuthSlice";
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await axios.post('http://localhost:9080/api/auth/logout', {}, {
        withCredentials: true,  // Ensure cookies are sent with the request
      });
  
      // Check if the response is successful
      if (response.data.success) {
        console.log(response.data.message);
        dispatch(logout());  // Dispatch logout action to Redux store
        navigate("/login");  // Redirect to the login page after logout
      }
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full z-10 top-0 left-0">
      <div className="container mx-auto px-6 py-4 md:px-12 md:py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Event Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/event.png" alt="Event Logo" className="h-12 w-12" />
            <span className="text-3xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300">
              Event
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Dashboard Button */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-800 hover:text-blue-600 transition duration-300 text-lg font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-[#000] text-white px-5 py-2 rounded-lg hover:bg-[#202020] transition duration-300 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-medium"
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
