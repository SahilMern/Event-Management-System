import { Link } from "react-router-dom";
import { FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/slice/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Redux se user state lena

  const handleLogout = () => {
    dispatch(logout()); // User ko logout karna
  };


  return (
    <nav className="p-4 px-16 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          Event
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
        {
          user && (
            <Link to="/" className="hover:text-gray-300 flex items-center">Home</Link>
          )
        }
          
          <Link to="/about" className="hover:text-gray-300 flex items-center">About Us</Link>
          <Link to="/contact" className="hover:text-gray-300 flex items-center">Contact Us</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-white px-4 py-2 rounded-l hover:bg-gray-200 flex items-center">
                <FaUser className="mr-1" /> Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-r flex items-center">
                <FaUserPlus className="mr-1" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
