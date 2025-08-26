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
