import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getAllBookings } from "../api/bookingsApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        
        // Transform API data to match UI structure
        const transformedBookings = data.map(booking => ({
          id: booking._id,
          taskerName: booking.tasker?.name || "Unassigned",
          taskerPic: booking.tasker?.profilePic || null,
          task: booking.description,
          date: new Date(booking.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: booking.time,
          duration: "2 hours",
          status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
          price: `$${booking.earnings || '-'}`,
          originalData: booking,
          // Add a normalized status for easier filtering
          normalizedStatus: booking.status.toLowerCase()
        }));
        
        setBookings(transformedBookings);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate status counts whenever bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const total = bookings.length;
      const completed = bookings.filter(b => b.normalizedStatus === "completed").length;
      const cancelled = bookings.filter(b => b.normalizedStatus === "cancelled").length;
      const pending = bookings.filter(b => 
        !["completed", "cancelled"].includes(b.normalizedStatus)
      ).length;
      
      setStatusCounts({ total, pending, completed, cancelled });
    }
  }, [bookings]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "✓";
      case "pending":
        return "⏱";
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      case "in progress":
        return "🔄";
      case "accepted":
        return "👍";
      default:
        return "";
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.taskerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.task.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (dateSort === "newest") {
        return new Date(b.originalData.date) - new Date(a.originalData.date);
      } else {
        return new Date(a.originalData.date) - new Date(b.originalData.date);
      }
    });

  const statusOptions = ["All", "Pending", "Accepted", "Confirmed", "Completed", "Cancelled", "In Progress"];

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
            <span className="mr-2">📅</span> Bookings
          </h1>
          <p className="text-xs text-gray-600">Manage and track all your bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-blue-100 mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                <p className="text-2xl font-bold text-gray-800">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-yellow-100 mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-800">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-green-100 mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-800">{statusCounts.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-red-100 mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                <p className="text-2xl font-bold text-gray-800">{statusCounts.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-3 rounded-lg shadow-xs border border-gray-100 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks or taskers..."
                className="text-xs pl-6 pr-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-1">
              <select
                className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <select
                className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow-xs rounded-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left text-gray-700 font-medium">Tasker</th>
                  <th className="p-2 text-left text-gray-700 font-medium">Task</th>
                  <th className="p-2 text-left text-gray-700 font-medium">Date/Time</th>
                  <th className="p-2 text-left text-gray-700 font-medium">Status</th>
                  <th className="p-2 text-left text-gray-700 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`border-t border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="p-2">
                        <div className="flex items-center">
                         {booking.taskerPic ? (
                            <img
                              src={booking.taskerPic}
                              alt={booking.taskerName}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-6 w-6 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs">
                              {booking.taskerName.charAt(0)}
                            </div>
                          )}
                          <div className="ml-2">
                            <p className="font-medium text-gray-800 truncate max-w-[80px]">{booking.taskerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-gray-600 max-w-[100px] truncate">{booking.task}</td>
                      <td className="p-2">
                        <div className="text-gray-600">{booking.date}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium flex items-center w-fit ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <span className="mr-1 text-[10px]">{getStatusIcon(booking.status)}</span>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-2 font-medium">
                        {booking.normalizedStatus === "completed" ? (
                          <span className="text-green-600">{booking.price}</span>
                        ) : booking.normalizedStatus === "cancelled" ? (
                          <span className="text-gray-400 line-through">{booking.price}</span>
                        ) : (
                          <span className="text-gray-600">{booking.price}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500 text-xs">
                      No bookings found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-xs text-gray-700 mb-2 sm:mb-0">
                Showing <span className="font-medium">{filteredBookings.length}</span> of{" "}
                <span className="font-medium">{bookings.length}</span> results
              </p>
              
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;