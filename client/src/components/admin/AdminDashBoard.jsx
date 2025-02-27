import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../Loading";

const AdminDashBoard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTotalUsers(5); // Dummy data
        setTotalEvents(10); // Dummy data
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div><Loading /></div>; // Optional loading indicator
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
          onClick={() => navigate("/admin/users")}
        >
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalUsers}</p>
          <p className="text-sm text-gray-500 mt-1">Click to view all users</p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
          onClick={() => navigate("/admin/events")}
        >
          <h2 className="text-xl font-semibold text-gray-700">Total Events</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalEvents}</p>
          <p className="text-sm text-gray-500 mt-1">Click to view all events</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashBoard;
