import axios from 'axios';

// Base URL of your backend
const API_URL = 'http://localhost:5000/api/users';

// Fetch all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data; // returns the array of users
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
