import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../redux/slice/AuthSlice";
import { loginApi } from "../helper/backend/backend";
// Replace with actual API endpoint

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  // console.log(user, "user");
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // For handling loading state during login
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${loginApi}`, formData, {
        withCredentials: true, // Include cookies in the request
      });

      // Dispatch login success action
      dispatch(
        loginSuccess({ user: response.data.user, token: response.data.token })
      );

      // Show success message
      toast.success("Login Successful! Redirecting...");

      // Redirect to home page
      navigate("/");
    } catch (err) {
      // Show error message
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-600 mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`w-full py-3 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
