import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import {
  Activity,
  BarChart3,
  Eye,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import QuickActionButton from "../components/QuickActionButton";
import { database } from "../firebase"; // Adjust path as needed
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);

  // Fetch users from Firebase
  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedUsers = Object.entries(data).map(([id, user]) => ({
          id, // Firebase key (e.g. "user1ID")
          ...user, // Spread user properties: name, cardId, etc.
        }));
        setUsers(loadedUsers);
      } else {
        setUsers([]);
      }
    });
  }, []);

  // Fetch access logs from Firebase
  useEffect(() => {
    const accessLogsRef = ref(database, "controle");
    onValue(accessLogsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedAccessLogs = Object.entries(data).map(([id, control]) => ({
          id, // Firebase key (e.g. "logEntry1ID")
          ...control, // Spread control properties: card, date, time, name, info, etc.
        }));
        setAccessLogs(loadedAccessLogs);
      } else {
        setAccessLogs([]);
      }
    });
  }, []);

  // if (accessLogs && accessLogs.length >= 2) {
  //   accessLogs.splice(accessLogs.length - 2, 2);
  //   console.log(accessLogs);
  // }

  // Calculate today's granted access
  const getTodayGrantedAccess = () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    return accessLogs.filter((log) => {
      const logDate = log.date; // Assuming date is in YYYY-MM-DD format
      return logDate === today && log.info === "Entrance";
    }).length;
  };

  // Get the most recent granted access based on the order of fetching (last added Firebase key)
  const getLastGrantedAccessByOrder = () => {
    const grantedLogs = accessLogs.filter((log) => log.info === "Entrance");

    if (grantedLogs.length === 0) {
      return null;
    }

    // Sort by Firebase ID (which are typically chronological if push() is used)
    // and then reverse to get the largest ID (most recent) at index 0.
    const sortedById = [...grantedLogs].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    // The largest ID will be at the end, so reverse to get it at the beginning
    const reversedSortedLogs = sortedById.reverse();

    return reversedSortedLogs[0];
  };

  const lastGrantedAccess = getLastGrantedAccessByOrder();

  const testarr = [...accessLogs].reverse();
  console.log(testarr[0]);

  return (
    <main className="p-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to AccessHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your central point for managing user access and monitoring activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          subtitle="Registered users in this system"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Access Logs"
          value={accessLogs.length.toString()}
          subtitle="Access attempts recorded"
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Granted Today"
          value={getTodayGrantedAccess().toString()}
          subtitle="Successful access events today"
          icon={Shield}
          color="bg-purple-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 ">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Granted Access
            </h3>
            <div className="space-y-4">
              {testarr && testarr ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-sm font-medium">
                        {testarr[0]?.name
                          ? testarr[0]?.name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {testarr[0]?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        accessed at {testarr[0]?.time} on {testarr[0]?.date}
                      </p>
                      <p className="text-xs text-gray-400">
                        Card: {testarr[0]?.card}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Granted
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No granted access found</p>
                </div>
              )}

              {/* This message implies that there might be more recent activity, but it's not being shown.
                  If `lastGrantedAccess` is truly the *last* one added, then this message might be confusing
                  if there are no other "more recent" items to show.
                  Consider removing or rephrasing based on your UX goals.
              */}
              {testarr &&
                accessLogs.filter((log) => log.info === "Entrance").length <=
                  1 && (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No more recent activity</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
