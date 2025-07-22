// src/components/UserManagement.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import '.././AdminDashboard.css'; // Reusing dashboard CSS for general styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch users from the backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://spring-apigateway.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users!"); // Toast notification
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle user deletion (example - you'd need a backend endpoint for this)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      // Assuming a DELETE endpoint for users exists
      await axios.delete(`https://spring-apigateway.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!"); // Success toast
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user!"); // Error toast
    }
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-dashboard-message">Loading users...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-message error">{error}</div>;
  }

  return (
    <div className="dashboard-content"> {/* Reusing dashboard-content styling */}
      <div className="admin-header">
        <h2>Customer Management</h2>
        <input
          type="text"
          placeholder="Search by username or email..."
          className="search-input" // Add a new class for search input styling
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="charts"> {/* Reusing 'charts' class for consistent card styling */}
        <h4>Registered Customers</h4>
        <table className="orders-table"> {/* Reusing orders-table styling */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles && user.roles.length > 0 ? user.roles.join(", ") : "N/A"}</td>
                  <td>
                    {/* Add actions like View Details, Edit (if applicable), Delete */}
                    {/* <button className="edit-btn" onClick={() => navigate(`/admin/users/${user.id}`)}>View</button> */}
                    <button className="decline-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-text">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;