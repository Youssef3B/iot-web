import React, { useEffect, useState } from "react";
import { User, Plus, MoreHorizontal, Trash2, Edit3, Users } from "lucide-react";
import { ref, onValue, push, remove, update } from "firebase/database"; // Import 'update'

import { database } from "../firebase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [cardId, setCardId] = useState("");
  const [editingUserId, setEditingUserId] = useState(null); // State to track which user is being edited
  const [editingUserName, setEditingUserName] = useState(""); // State to hold the name during editing

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
      } else {
        setUsers([]); // Clear users if no data exists
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

  // Function to start editing a user
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingUserName(user.name);
  };

  // Function to save the edited user name
  const handleSaveEdit = async (userId) => {
    if (!editingUserName.trim()) {
      alert("User name cannot be empty.");
      return;
    }
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { name: editingUserName }); // Update only the 'name' field
      setEditingUserId(null); // Exit editing mode
      setEditingUserName(""); // Clear editing name state
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUserName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
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
                            {editingUserId === user.id ? (
                              <input
                                type="text"
                                value={editingUserName}
                                onChange={(e) =>
                                  setEditingUserName(e.target.value)
                                }
                                className="w-full px-2 py-1 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            ) : (
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
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-mono">
                              {user.card}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {editingUserId === user.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(user.id)}
                                  className="bg-green-500 px-4 py-1 text-white rounded-full cursor-pointer hover:bg-green-600 transition-colors duration-200 mr-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-slate-400 px-4 py-1 text-white rounded-full cursor-pointer hover:bg-slate-500 transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="bg-blue-400 px-4 py-1 text-white rounded-full cursor-pointer hover:bg-blue-500 transition-colors duration-200 mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-400 px-4 py-1 text-white rounded-full cursor-pointer hover:bg-red-500 transition-colors duration-200"
                                >
                                  Delete
                                </button>
                              </>
                            )}
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
