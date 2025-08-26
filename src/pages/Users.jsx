import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaUsers,
  FaSearch,
  FaBell,
  FaEdit,
  FaTrash,
  FaEye,
  FaBan,
  FaCheckCircle,
  FaFilter,
  FaPlus,
  FaEnvelope,
  FaEllipsisV,
  FaSpinner
} from "react-icons/fa";
import { getAllUsers } from '../api/usersApi'; // Import your API function

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-3 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-600 text-2xl mx-auto mb-3" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-3 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content - Made more compact */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Header - Made more compact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 text-lg mr-2" />
            <h1 className="text-lg font-semibold text-gray-800">Users</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {users.length} total
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-48 border border-gray-200 rounded-md pl-7 pr-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            <button className="relative p-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm">
              <FaBell />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-1">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h-256&q=80"
                alt="profile"
                className="w-6 h-6 rounded-full border border-white"
              />
            </div>
          </div>
        </div>

        {/* Action Bar - Made more compact */}
        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-xs mb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-md pl-2 pr-6 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs w-32"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <FaFilter className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
              
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">{selectedUsers.length} selected</span>
                  <button className="text-red-500 hover:text-red-700 p-0.5 text-xs">
                    <FaTrash />
                  </button>
                  <button className="text-blue-500 hover:text-blue-700 p-0.5 text-xs">
                    <FaEnvelope />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md text-xs font-medium transition-colors">
                <FaPlus className="text-xs" />
                Add User
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md text-xs">
                <FaEllipsisV />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table - Removed Last Login column */}
        <div className="bg-white rounded-md border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-3 py-2 w-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3"
                    />
                  </th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Join Date</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                            alt={user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          <button 
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button 
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Edit User"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          {user.status === 'active' ? (
                            <button 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Suspend User"
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                            >
                              <FaBan className="text-xs" />
                            </button>
                          ) : (
                            <button 
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Activate User"
                              onClick={() => handleStatusChange(user.id, 'active')}
                            >
                              <FaCheckCircle className="text-xs" />
                            </button>
                          )}
                          <button 
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 py-4 text-center text-gray-500 text-xs">
                      {searchTerm || statusFilter !== 'all' 
                        ? "No users found matching your criteria." 
                        : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Made more compact */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-xs text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> results
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              Prev
            </button>
            <button className="px-2 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded text-xs font-medium">
              1
            </button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}