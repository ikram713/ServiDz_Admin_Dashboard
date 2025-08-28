import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users"; // Import the Users component
import Taskers from "./pages/Taskers";
import Bookings from "./pages/Bookings"; // Import the Bookings component
import Services from "./pages/Services"; // Import the Services component
import Profile from "./pages/Profile"; // Import the Profile component

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin login route */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} /> 
        <Route path="/taskers" element={<Taskers />} /> 
        <Route path="/bookings" element={<Bookings />} /> 
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;