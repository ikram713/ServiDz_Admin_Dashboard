import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users"; // Import the Users component

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin login route */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} /> {/* Add Users route */}
      </Routes>
    </Router>
  );
}

export default App;