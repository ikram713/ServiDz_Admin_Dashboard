import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

// Fetch Dashboard Analytics
export const getDashboardAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
};
