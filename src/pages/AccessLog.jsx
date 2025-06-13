import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ref, onValue, push, remove } from "firebase/database";
import { database } from "../firebase";

export default function AccessLogComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [AllaccessLogs, setAccessLogs] = useState([]); // Initialize with empty array

  useEffect(() => {
    const accesslogsref = ref(database, "controle");
    onValue(accesslogsref, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedacceslogers = Object.entries(data).map(([id, control]) => ({
          id, // Firebase key (e.g. "user1ID")
          ...control, // Spread user properties: name, cardId, etc.
        }));
        // Sort the logs from newest to oldest based on the 'date' and 'time' fields
        // Assuming 'date' is in a sortable format (e.g., YYYY-MM-DD) and 'time' (e.g., HH:MM:SS)
        const sortedAccessLogs = loadedacceslogers.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeB - dateTimeA; // For descending order (newest first)
        });
        setAccessLogs(sortedAccessLogs);
      } else {
        setAccessLogs([]); // Set empty array if no data
      }
    });
  }, []);

  // Filter the Firebase data instead of hardcoded data
  const filteredLogs = AllaccessLogs.filter((log) => {
    const matchesSearch =
      log.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

    // Convert indice to status for filtering
    const status = log.indice === 1 ? "granted" : "denied";
    const matchesFilter = selectedFilter === "all" || status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    return status === "granted" ? (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status) => {
    return status === "granted"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Access Log</h1>
          </div>
          <p className="text-slate-600">
            Record of all access attempts and their statuses (
            {AllaccessLogs.length} total entries)
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search logs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="granted">Granted</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Access Log Table */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    User Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Timestamp
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    CardId
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {log.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {log.name || "Unknown User"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          {log.date} {log.time}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{log.card}</td>
                      <td className="py-4 px-6">
                        <div
                          className={`flex items-center justify-center ${
                            log.indice === 1 ? "bg-green-400" : "bg-red-400"
                          } text-white rounded-full py-1 px-3`}
                        >
                          <p>{log.indice === 1 ? "granted" : "denied"}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : AllaccessLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        No access logs available
                      </h3>
                      <p className="text-slate-500">
                        Access logs will appear here once data is available
                      </p>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        No logs found
                      </h3>
                      <p className="text-slate-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
