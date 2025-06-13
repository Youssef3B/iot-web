import React from "react";
import { Shield, Users, Activity, BarChart3, Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Link, Outlet } from "react-router-dom";
function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AccessHub</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            <Link to={"/"}>
              <p
                className={`flex items-center px-4 py-3 ${
                  location.pathname === "/" && " text-blue-600 bg-blue-50"
                } rounded-lg font-medium cursor-pointer transition-colors duration-200`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </p>
            </Link>
            <Link to={"/Users"}>
              <p
                className={`flex items-center px-4 py-3 ${
                  location.pathname === "/Users" && " text-blue-600 bg-blue-50"
                } rounded-lg font-medium cursor-pointer transition-colors duration-200`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </p>
            </Link>
            <Link to={"AccessLog"}>
              <p
                className={`flex items-center px-4 py-3 ${
                  location.pathname === "/AccessLog" &&
                  " text-blue-600 bg-blue-50"
                } rounded-lg font-medium cursor-pointer transition-colors duration-200`}
              >
                <Activity className="w-5 h-5 mr-3" />
                Access Log
              </p>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">
                Your central point for managing user access and monitoring
                activity
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
