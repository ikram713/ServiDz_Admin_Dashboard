import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin login route */}
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
