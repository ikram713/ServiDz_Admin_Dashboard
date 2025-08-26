import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaDollarSign,
  FaSearch,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisV,
  FaFilter
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { getDashboardAnalytics } from "../api/dashboardApi";
import { getAdminProfile } from "../api/admin"; // Import the admin API

// Dummy data (will be replaced by API)
const defaultEarningsData = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 200 },
  { name: "Mar", value: 150 },
  { name: "Apr", value: 80 },
  { name: "May", value: 300 },
  { name: "Jun", value: 250 },
];

const defaultCategoriesData = [
  { name: "Plumbing", value: 400 },
  { name: "Car Repair", value: 300 },
  { name: "Electricity", value: 300 },
  { name: "Cleaning", value: 200 },
];

const defaultActivities = [
  { id: 1, activity: "New user signup", type: "User", date: "Apr 29, 2024", status: "completed" },
  { id: 2, activity: "Tasker application approved", type: "Tasker", date: "Apr 28, 2024", status: "completed" },
  { id: 3, activity: "New booking created", type: "Booking", date: "Apr 27, 2024", status: "pending" },
  { id: 4, activity: "Payment processed", type: "Payment", date: "Apr 26, 2024", status: "completed" },
  { id: 5, activity: "Service complaint", type: "Support", date: "Apr 25, 2024", status: "processing" },
];

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [adminData, setAdminData] = useState(null); // State for admin profile
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true); // Separate loading for profile
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null); // Separate error for profile

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardAnalytics();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
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

    fetchDashboardData();
    fetchAdminProfile();
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Calculate percentage change with arrow indicator
  const renderChangeIndicator = (value) => {
    const numericValue = parseFloat(value);
    if (numericValue > 0) {
      return (
        <span className="text-xs text-green-600 flex items-center font-medium">
          <FaArrowUp className="mr-0.5" /> {value}%
        </span>
      );
    } else if (numericValue < 0) {
      return (
        <span className="text-xs text-red-600 flex items-center font-medium">
          <FaArrowDown className="mr-0.5" /> {Math.abs(value)}%
        </span>
      );
    } else {
      return (
        <span className="text-xs text-gray-600 flex items-center font-medium">
          {value}%
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => window.location.reload()}
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

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Header with Search, Notification and Profile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for users, bookings, or tasks..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1 text-gray-500 hover:text-blue-600 transition-colors">
              <FaBell className="text-lg" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Admin Profile Section */}
            {profileLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden md:block">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : profileError ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs">⚠️</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-gray-500">Error</p>
                  <p className="text-xs text-gray-400">Loading profile failed</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={adminData?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h-256&q=80"}
                  alt="profile"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h-256&q=80";
                  }}
                />
                <div className="hidden md:block">
                  <p className="text-xs font-medium">{adminData?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{adminData?.email || "Administrator"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-3 py-1.5 text-xs font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabClick("overview")}
          >
            Overview
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium ${activeTab === "analytics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabClick("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium ${activeTab === "reports" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => handleTabClick("reports")}
          >
            Reports
          </button>
        </div>

        {/* Stats Cards - Only show in Overview tab */}
        {activeTab === "overview" && dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-md bg-blue-100">
                  <FaUsers className="text-blue-600 text-lg" />
                </div>
                {renderChangeIndicator(dashboardData.analytics.users.growth)}
              </div>
              <p className="text-gray-500 text-xs">Total Users</p>
              <h2 className="text-xl font-bold text-gray-800">{formatNumber(dashboardData.totalUsers)}</h2>
              <p className="text-xs text-gray-500 mt-0.5">+{dashboardData.analytics.users.today} today</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-md bg-green-100">
                  <FaUserTie className="text-green-600 text-lg" />
                </div>
                {renderChangeIndicator(dashboardData.analytics.taskers.growth)}
              </div>
              <p className="text-gray-500 text-xs">Total Taskers</p>
              <h2 className="text-xl font-bold text-gray-800">{formatNumber(dashboardData.totalTaskers)}</h2>
              <p className="text-xs text-gray-500 mt-0.5">+{dashboardData.analytics.taskers.today} today</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-md bg-red-100">
                  <FaCalendarCheck className="text-red-500 text-lg" />
                </div>
                {renderChangeIndicator(dashboardData.analytics.bookings.growth)}
              </div>
              <p className="text-gray-500 text-xs">Today's Bookings</p>
              <h2 className="text-xl font-bold text-gray-800">{formatNumber(dashboardData.todaysBookings)}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Yesterday: {dashboardData.analytics.bookings.yesterday}</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-md bg-yellow-100">
                  <FaDollarSign className="text-yellow-600 text-lg" />
                </div>
                {renderChangeIndicator(dashboardData.analytics.earnings.growth)}
              </div>
              <p className="text-gray-500 text-xs">Today's Earnings</p>
              <h2 className="text-xl font-bold text-gray-800">${formatNumber(dashboardData.todaysEarnings)}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Yesterday: ${dashboardData.analytics.earnings.yesterday}</p>
            </div>
          </div>
        )}

        {/* Charts Container - Single row for both charts */}
        {(activeTab === "overview" || activeTab === "analytics") && (
          <div className="flex flex-col lg:flex-row md:flex-row gap-4 mb-4">
            {/* Earnings Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">
                  {activeTab === "overview" ? "Monthly Earnings" : "Revenue by Month"}
                </h3>
                <div className="flex items-center gap-1">
                  <button className="text-gray-400 hover:text-gray-600 p-0.5">
                    <FaFilter size={12} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-0.5">
                    <FaEllipsisV size={12} />
                  </button>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defaultEarningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00386F" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Categories Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">Service Distribution</h3>
                <div className="flex items-center gap-1">
                  <button className="text-gray-400 hover:text-gray-600 p-0.5">
                    <FaFilter size={12} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-0.5">
                    <FaEllipsisV size={12} />
                  </button>
                </div>
              </div>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={defaultCategoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label
                    >
                      {defaultCategoriesData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {defaultCategoriesData.map((cat, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: COLORS[index] }}
                    ></span>
                    <span className="text-xs text-gray-600">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities - Show in all tabs */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-gray-800">Recent Activities</h3>
            <button className="text-xs text-blue-600 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {defaultActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors border border-gray-100">
                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' : 
                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{activity.activity}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{activity.type}</span>
                    <span className="mx-1">•</span>
                    <span className="text-xs">{activity.date}</span>
                  </div>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}