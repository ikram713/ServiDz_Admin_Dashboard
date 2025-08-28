import React from "react";
import Sidebar from "../components/Sidebar";
import { FaLayerGroup } from "react-icons/fa";

// Category icons
import plumberIcon from "../assets/icons/plumber.png";
import electrecianIcon from "../assets/icons/electrecian.png";
import cleaningIcon from "../assets/icons/cleaner.png";
import carpentryIcon from "../assets/icons/carpenter.png";
import paintingIcon from "../assets/icons/painter.png";
import gardeningIcon from "../assets/icons/gardener.png";
// Service images

import service1 from "../assets/overviewImages/1.jpg";
import service2 from "../assets/overviewImages/2.jpg";
import service3 from "../assets/overviewImages/3.jpg";
import service4 from "../assets/overviewImages/4.jpg";
import service5 from "../assets/overviewImages/5.jpg";
import service6 from "../assets/overviewImages/6.jpg";

export default function AdminDashboard() {
  const categories = [
    { name: "Plumbing", img: plumberIcon },
    { name: "Electrician", img: electrecianIcon },
    { name: "Cleaning", img: cleaningIcon },
    { name: "Carpentry", img: carpentryIcon },
    { name: "Painting", img: paintingIcon },
    { name: "Gardening", img: gardeningIcon },
  ];

  const services = [service1, service2, service3, service4, service5, service6];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Categories Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add New Category
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100"
              >
                <div className="bg-gray-50 p-3 rounded-full mb-3">
                  <img src={cat.img} alt={cat.name} className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Overview Section */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Services Overview
            </h2>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((srv, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-blue-100"
              >
                <img
                  src={srv}
                  alt="service"
                  className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
