// api/bookingsApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // change IP if needed

// ✅ Get all bookings (admin side)
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/all`);
    return response.data; // This will return the array you showed
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};
