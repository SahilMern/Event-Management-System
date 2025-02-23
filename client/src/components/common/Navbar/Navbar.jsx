import { Link } from "react-router-dom";
import {
  FaSignOutAlt,
  // FaTachometerAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/slice/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux

  const handleLogout = () => {
    dispatch(logout()); // Logout the user
  };

  return (
    <nav className="bg-white shadow ">
      <div className="container mx-auto px-24 py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Event Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={"./event.png"} alt="Event Logo" className="h-10 w-10" />
            {/* Logo Image */}
            <span className="text-2xl font-bold text-gray-800 hover:text-gray-600">
              Event
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-black hover:text-gray-700 transition duration-300 text-base uppercase "
              style={{ fontSize: "1.1rem" }}
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-black hover:text-gray-700 transition duration-300 text-base uppercase"
              style={{ fontSize: "1.1rem" }}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="text-black hover:text-gray-700 transition duration-300 text-base uppercase"
              style={{ fontSize: "1.1rem" }}
            >
              Contact Us
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Dashboard Button */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-500 transition duration-300 text-base uppercase"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition duration-300"
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