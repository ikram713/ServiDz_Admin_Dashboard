import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 for redirect after login
import { loginAdmin } from "../api/loginApi"; 
import loginBg from "../assets/login_bg.png";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 show errors if login fails
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginAdmin(email, password);
      console.log("Login success:", data);

      // store token in localStorage
      localStorage.setItem("adminToken", data.token);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.message || err?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex font-sans overflow-hidden">
      {/* Left side background image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 z-10"></div>
        <img
          src={loginBg}
          alt="Login background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to Servidz Admin</h2>
          <p className="text-lg opacity-90">
            Manage your services efficiently with our powerful admin dashboard
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5">
          <div className="flex justify-center mb-3">
            <img 
              src={logo} 
              alt="Servidz Logo" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
            Admin Login
          </h2>
          
          <p className="text-gray-600 text-center mb-4 text-sm">
            Sign in to access your dashboard
          </p>

          {/* error message */}
          {error && (
            <p className="text-red-500 text-center text-sm mb-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-1 text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-blue-600 hover:text-blue-500 text-xs">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            >
              Login
            </button>
          </form>

          <div className="mt-3 text-center text-xs text-gray-600">
            <p>© 2023 Servidz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
