import axios from 'axios';

// Base URL of your backend
const API_URL = 'http://localhost:5000/api/admin';

// Get admin profile
export const getAdminProfile = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No admin token found. Please login.');

    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // use the token from localStorage
      },
    });

    return response.data; // will contain {_id, email, name, avatar}
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error.response?.data || { message: 'Failed to fetch admin profile' };
  }
};

// Upload / Update admin avatar
export const uploadAdminAvatar = async (file) => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("No admin token found. Please login.");

    const formData = new FormData();
    formData.append("avatar", file); // Changed from "serviDZ_uploads" to "avatar"

    const response = await axios.put(`${API_URL}/avatar`, formData, { // Changed from POST to PUT
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { message, avatar }
  } catch (error) {
    console.error("Error uploading admin avatar:", error);
    throw error.response?.data || { message: "Failed to upload avatar" };
  }
};