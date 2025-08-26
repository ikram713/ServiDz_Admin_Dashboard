import axios from 'axios';

// Base URL of your backend
const API_URL = 'http://localhost:5000/api/taskers';

// Fetch all taskers
export const getAllTaskers = async () => {
    try {
    const response = await axios.get(`${API_URL}/all`); // match your backend route
    return response.data; // returns the formatted array of taskers
    } catch (error) {
    console.error('Error fetching taskers:', error);
    throw error;
    }
};

export const banTasker = async (taskerId) => {
  try {
    const response = await axios.put(`${API_URL}/ban-tasker/${taskerId}`);
    return response.data;
  } catch (error) {
    console.error('Error banning tasker:', error);
    throw error;
  }
};

// Activate a tasker by ID
export const activateTasker = async (taskerId) => {
  try {
    const response = await axios.put(`${API_URL}/activate-tasker/${taskerId}`);
    return response.data; // returns { message: 'Tasker activated successfully' }
  } catch (error) {
    console.error('Error activating tasker:', error);
    throw error;
  }
};