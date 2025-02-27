import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChangeUsersRole,
  EditUsers,
  getAllUsers,
} from "../../../../helper/backend/backend";
import Loading from "../../../Loading";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  //TODO:- Fetch All User Details
  const fetchUsers = async () => {
    try {
      const response = await axios.get(getAllUsers);
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  //TODO:- Delete User
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;
    setActionLoading(true);
    try {
      await axios.delete(`${EditUsers}/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  //TODO:- Changing User Role
  const handleRoleChange = async (userId, newRole) => {
    const confirmChange = window.confirm(
      `Change this user's role to ${newRole}?`
    );
    if (!confirmChange) return;

    setActionLoading(true);
    try {
      await axios.patch(`${ChangeUsersRole}/${userId}/change-role`, {
        role: newRole,
      });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("User role updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to update user role.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Users</h1>

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
                    disabled={actionLoading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-4">
                    <Link
                      to={`/admin/edit-user/${user._id}`}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit user"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={actionLoading}
                      aria-label="Delete user"
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
