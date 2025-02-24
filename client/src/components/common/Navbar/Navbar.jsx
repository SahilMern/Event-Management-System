import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/slice/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux

  const handleLogout = () => {
    dispatch(logout()); // Logout the user
  };

  return (
    <nav className="bg-white shadow-md  w-full z-10 top-0 left-0">
      <div className="container mx-auto px-6 py-4 md:px-12 md:py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Event Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={"./event.png"} alt="Event Logo" className="h-12 w-12" />
            {/* Logo Image */}
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
                  className="cursor-pointer bg-[#f73d3d] text-white px-5 py-2 rounded-lg hover:bg-[#f73d3dd9] transition duration-300 flex items-center"
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
