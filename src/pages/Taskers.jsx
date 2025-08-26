import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaUserTie,
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
  FaSpinner,
  FaStar,
  FaTools
} from "react-icons/fa";
import { getAllTaskers } from '../api/taskersApi';
import { banTasker } from '../api/taskersApi';
import { getAdminProfile } from "../api/admin"; // Import the admin API

export default function Taskers() {
  const [taskers, setTaskers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTaskers, setSelectedTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [banningTaskerId, setBanningTaskerId] = useState(null);
  const [adminData, setAdminData] = useState(null); // State for admin profile

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Fetch taskers from API
  useEffect(() => {
    const fetchTaskers = async () => {
      try {
        setLoading(true);
        const taskersData = await getAllTaskers();
        
        // Transform API data to match component expectations
        const formattedTaskers = taskersData.map(tasker => ({
          id: tasker.id,
          name: tasker.name,
          email: tasker.email,
          phone: tasker.phone || 'N/A',
          profession: tasker.skills || 'General Tasker',
          status: tasker.status ? tasker.status.toLowerCase() : 'active',
          joinDate: formatDate(tasker.joinDate || tasker.createdAt),
          rating: tasker.rating || 0,
          completedTasks: tasker.completedTasks || 0,
          avatar: tasker.profileImage || tasker.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          // Include original data for potential use
          originalData: tasker
        }));
        
        setTaskers(formattedTaskers);
      } catch (err) {
        console.error("Error fetching taskers:", err);
        setError("Failed to load taskers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdminProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await getAdminProfile();
        setAdminData(data);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        setProfileError("Failed to load admin profile.");
        
        // If it's an authentication error, redirect to login
        if (err.message.includes('token') || err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchTaskers();
    fetchAdminProfile();
  }, []);

  // Handle ban tasker action
  const handleBanTasker = async (taskerId) => {
    try {
      setBanningTaskerId(taskerId);
      await banTasker(taskerId);
      
      // Update the tasker status in the local state
      setTaskers(taskers.map(tasker => 
        tasker.id === taskerId ? { ...tasker, status: 'suspended' } : tasker
      ));
      
      alert('Tasker banned successfully');
    } catch (err) {
      console.error("Error banning tasker:", err);
      alert('Failed to ban tasker. Please try again.');
    } finally {
      setBanningTaskerId(null);
    }
  };

  // Handle activate tasker action
  const handleActivateTasker = async (taskerId) => {
    try {
      // You'll need to create an activateTasker API function
      // For now, just update the local state
      setTaskers(taskers.map(tasker => 
        tasker.id === taskerId ? { ...tasker, status: 'active' } : tasker
      ));
      
      alert('Tasker activated successfully');
    } catch (err) {
      console.error("Error activating tasker:", err);
      alert('Failed to activate tasker. Please try again.');
    }
  };

  // Filter taskers based on search term and status filter
  const filteredTaskers = taskers.filter(tasker => {
    const matchesSearch = tasker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tasker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tasker.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tasker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectTasker = (taskerId) => {
    if (selectedTaskers.includes(taskerId)) {
      setSelectedTaskers(selectedTaskers.filter(id => id !== taskerId));
    } else {
      setSelectedTaskers([...selectedTaskers, taskerId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTaskers.length === filteredTaskers.length) {
      setSelectedTaskers([]);
    } else {
      setSelectedTaskers(filteredTaskers.map(tasker => tasker.id));
    }
  };

  const handleDeleteTasker = (taskerId) => {
    if (window.confirm("Are you sure you want to delete this tasker?")) {
      setTaskers(taskers.filter(tasker => tasker.id !== taskerId));
      setSelectedTaskers(selectedTaskers.filter(id => id !== taskerId));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-3 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-600 text-2xl mx-auto mb-3" />
            <p className="text-gray-600">Loading taskers...</p>
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
            <FaUserTie className="text-blue-600 text-lg mr-2" />
            <h1 className="text-lg font-semibold text-gray-800">Taskers</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {taskers.length} total
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search taskers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-48 border border-gray-200 rounded-md pl-7 pr-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            <button className="relative p-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm">
              <FaBell />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Admin Profile Section */}
            {profileLoading ? (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            ) : profileError ? (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs">⚠️</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <img
                  src={adminData?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h-256&q=80"}
                  alt="profile"
                  className="w-6 h-6 rounded-full border border-white"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h-256&q=80";
                  }}
                />
              </div>
            )}
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
              
              {selectedTaskers.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">{selectedTaskers.length} selected</span>
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
                Add Tasker
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md text-xs">
                <FaEllipsisV />
              </button>
            </div>
          </div>
        </div>

        {/* Taskers Table - Made more compact */}
        <div className="bg-white rounded-md border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-3 py-2 w-6">
                    <input
                      type="checkbox"
                      checked={selectedTaskers.length === filteredTaskers.length && filteredTaskers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3"
                    />
                  </th>
                  <th className="px-3 py-2">Tasker</th>
                  <th className="px-3 py-2">Profession</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Join Date</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTaskers.length > 0 ? (
                  filteredTaskers.map(tasker => (
                    <tr key={tasker.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedTaskers.includes(tasker.id)}
                          onChange={() => handleSelectTasker(tasker.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 h-3 w-3"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={tasker.avatar}
                            alt={tasker.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{tasker.name}</p>
                            <p className="text-xs text-gray-500">{tasker.email}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <FaStar className="text-yellow-400 text-xs" />
                              <span className="text-xs text-gray-500">{tasker.rating}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{tasker.completedTasks} tasks</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <FaTools className="text-gray-400 text-xs" />
                          <span className="text-xs font-medium text-gray-700">{tasker.profession}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          tasker.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : tasker.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tasker.status ? tasker.status.charAt(0).toUpperCase() + tasker.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {tasker.joinDate}
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
                            title="Edit Tasker"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          {tasker.status === 'active' ? (
                            <button 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Ban Tasker"
                              onClick={() => handleBanTasker(tasker.id)}
                              disabled={banningTaskerId === tasker.id}
                            >
                              {banningTaskerId === tasker.id ? (
                                <FaSpinner className="text-xs animate-spin" />
                              ) : (
                                <FaBan className="text-xs" />
                              )}
                            </button>
                          ) : (
                            <button 
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Activate Tasker"
                              onClick={() => handleActivateTasker(tasker.id)}
                            >
                              <FaCheckCircle className="text-xs" />
                            </button>
                          )}
                          <button 
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Tasker"
                            onClick={() => handleDeleteTasker(tasker.id)}
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-gray-500 text-xs">
                      {searchTerm || statusFilter !== 'all' 
                        ? "No taskers found matching your criteria." 
                        : "No taskers found."}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTaskers.length}</span> of{' '}
            <span className="font-medium">{taskers.length}</span> results
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