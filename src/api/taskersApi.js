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
