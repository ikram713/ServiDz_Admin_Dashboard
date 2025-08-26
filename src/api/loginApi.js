import axios from "axios";

const API_URL = "http://localhost:5000/api/admin"; // your backend URL

// Admin login function
export const loginAdmin = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });

    // Store the token in local storage
    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
    }

    return res.data; // contains token & user data
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
