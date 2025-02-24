import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEdits = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission

  // Fetch user details by ID
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:9080/api/user/${id}`);
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user details");
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set loading state
    try {
      const response = await axios.put(
        `http://localhost:9080/api/user/${id}`,
        user
      );
      toast.success("User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 2000); // Redirect to users page after 2 seconds
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSubmitting(false); // Reset loading state
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Edit User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter full name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role Field */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-sm text-gray-600 mb-2">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={user.role}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
            disabled={submitting} // Disable button while submitting
          >
            {submitting ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserEdits;