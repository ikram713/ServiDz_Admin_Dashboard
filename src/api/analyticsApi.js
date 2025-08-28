// src/api/analyticsApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/analytics"; // adjust base URL if needed

// Get taskers distribution (admin only)
export const getTaskersDistribution = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/taskers-distribution`, {
      headers: {
        Authorization: `Bearer ${token}`, // admin JWT
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching taskers distribution:", error);
    throw error;
  }
};

// ✅ Get monthly earnings
export const fetchMonthlyEarnings = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/monthly-earnings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
    throw error;
  }
};