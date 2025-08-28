// api/activityApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your backend URL

// Fetch recent activities for admin dashboard
export const fetchRecentActivities = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/recent-activities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // Array of recent activities
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};
