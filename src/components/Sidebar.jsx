import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaShoppingBag,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

// Import your logo
import logo from "../assets/white_logo.png";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt size={18} /> },
    { name: "Users", icon: <FaUsers size={18} /> },
    { name: "Taskers", icon: <FaUserTie size={18} /> },
    { name: "Services", icon: <FaShoppingBag size={18} /> },
    { name: "Bookings", icon: <FaCalendarCheck size={18} /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemName) => {
    setActive(itemName);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-[#00386F] text-white shadow-lg transition-all hover:scale-105"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-[#00386F] text-white flex flex-col justify-between shadow-xl z-50
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? `w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : isCollapsed
            ? "w-16"
            : "w-56 translate-x-0"
        }
      `}
      >
        {/* Logo Section */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-blue-700/30">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="ServiDZ Logo"
                  className="w-10 h-10 rounded-lg"
                />
                <h1 className="text-lg font-bold text-white">ServiDZ</h1>
              </div>
            )}
            {isCollapsed && (
              <img
                src={logo}
                alt="ServiDZ Logo"
                className="w-10 h-10 rounded-lg mx-auto"
              />
            )}
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
              >
                {isCollapsed ? (
                  <FaChevronRight size={14} />
                ) : (
                  <FaChevronRight size={14} className="rotate-180" />
                )}
              </button>
            )}
          </div>

          {/* Menu */}
          <nav className="mt-6 flex flex-col space-y-2 px-3">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-lg text-left group relative
                  ${
                    active === item.name
                      ? "bg-blue-700 font-semibold shadow-inner"
                      : "hover:bg-blue-800 hover:shadow-md"
                  } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span
                  className={`${
                    active === item.name ? "text-blue-200" : "text-white"
                  } group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {active === item.name && (
                      <div className="absolute right-2 w-2 h-2 bg-blue-200 rounded-full"></div>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div
          className={`px-3 mb-6 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <button
            className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-800 w-full rounded-lg transition-colors hover:shadow-md ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt size={18} />
            {!isCollapsed && "LogOut"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
        flex-1 transition-all duration-300 ease-in-out overflow-auto
        ${
          isMobile && isOpen
            ? "ml-64"
            : !isMobile
            ? isCollapsed
              ? "ml-16"
              : "ml-56"
            : "ml-0"
        }
      `}
      ></div>
    </div>
  );
};

export default Sidebar;
