import React, { useEffect, useState } from "react";
import { User, Plus, MoreHorizontal, Trash2, Edit3, Users } from "lucide-react";
import { ref, onValue, push, remove } from "firebase/database";

import { database } from "../firebase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const [fullName, setFullName] = useState("");
  const [cardId, setCardId] = useState("");

  const [showDropdown, setShowDropdown] = useState(null);
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
      }
    });
  }, []);

  const handleAddUser = async () => {
    if (!fullName.trim() || !cardId.trim()) {
      alert("Please enter both name and card ID.");
      return;
    }

    const newUser = {
      name: fullName,
      card: cardId,
    };

    try {
      const usersRef = ref(database, "users");
      await push(usersRef, newUser);
      setFullName("");
      setCardId("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await remove(userRef);
      console.log(`User ${userId} deleted`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="my-4">
          {/* Add New User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Add New User
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Enter the details for the new user.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl ..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardId"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Card ID / Number
                  </label>
                  <input
                    type="text"
                    id="cardId"
                    name="cardId"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    placeholder="e.g. CARD123XYZ"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl ..."
                  />
                </div>

                <button
                  onClick={handleAddUser}
                  className="w-full bg-gradient-to-r py-3 cursor-pointer text-white rounded-3xl from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Registered Users
                    </h2>
                    <p className="text-slate-300 text-sm">
                      List of all users in the system.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {users.length} users
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              {users.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    No users yet
                  </h3>
                  <p className="text-slate-500">
                    Add your first user to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                          Name
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                          Card ID
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 transition-colors duration-150"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-slate-900">
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-mono">
                              {user.card}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-400 px-4 py-1 text-white rounded-full cursor-pointer hover:bg-red-500 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
