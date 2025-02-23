import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaUserCog } from "react-icons/fa";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9080/api/user");
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Delete a user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9080/api/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Remove user from state
    } catch (error) {
      setError(error.message);
    }
  };

  // Change user role
  const handleRoleChange = async (userId, newRole) => {
    const confirmChange = window.confirm(`Change this user's role to ${newRole}?`);
    if (!confirmChange) return;

    try {
      const response = await axios.patch(
        `http://localhost:9080/api/user/${userId}/change-role`,
        { role: newRole }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Users</h1>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-4 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-4">
                    <Link
                      to={`/edit-user/${user._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;