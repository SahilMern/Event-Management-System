import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const navigate = useNavigate();

  // Fetch total users and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:9080/api/events/total-users");
        const eventsResponse = await axios.get("http://localhost:9080/api/admin/total-events");

        setTotalUsers(usersResponse.data.totalUsers);
        setTotalEvents(eventsResponse.data.totalEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Users Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/users")}
        >
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalUsers}</p>
          <p className="text-sm text-gray-500 mt-1">Click to view all users</p>
        </div>

        {/* Total Events Card */}
        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/events")}
        >
          <h2 className="text-xl font-semibold text-gray-700">Total Events</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalEvents}</p>
          <p className="text-sm text-gray-500 mt-1">Click to view all events</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;