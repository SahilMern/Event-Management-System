import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  EditUsers, updateUser } from "../../../../helper/backend/backend";
import Loading from "../../../Loading";

const UserEdits = () => {
  const { id } = useParams(); //Dynamic we get from url
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  //TODO:- Fetch User Details
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${EditUsers}/${id}`);
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user details");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //TODO:- Handle Changes 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.put(
        `${updateUser}/${id}`,
        user
      );
      // console.log(response, "response");
      
      toast.success("User updated successfully!");
      setTimeout(() => navigate("/admin/users"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return <Loading />;
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
        
        {/* Handling form data */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 disabled:bg-blue-400 cursor-pointer"
            disabled={submitting}
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
