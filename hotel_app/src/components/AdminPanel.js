// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css"; // Ensure you have the corresponding CSS file

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem("token");

  
  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (activeTab === "pending") {
        url = "http://localhost:5000/api/hotels/hotel-requests";
      } else if (activeTab === "approved") {
        url = "http://localhost:5000/api/hotels/approved";
      } else if (activeTab === "users") {
        url = "http://localhost:5000/api/users";
      } else if (activeTab === "bookings") {
        url = "http://localhost:5000/api/bookings";
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Actions for pending hotels
  const approveHotel = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/hotels/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((item) => item._id !== id));
      alert("Hotel approved successfully");
    } catch (error) {
      console.error("Error approving hotel:", error.response?.data || error.message);
    }
  };

  const disapproveHotel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/disapprove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((item) => item._id !== id));
      alert("Hotel disapproved and deleted successfully");
    } catch (error) {
      console.error("Error disapproving hotel:", error.response?.data || error.message);
    }
  };

  // Action for approved hotels: delete hotel
  const deleteApprovedHotel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((item) => item._id !== id));
      alert("Hotel deleted successfully");
    } catch (error) {
      console.error("Error deleting hotel:", error.response?.data || error.message);
    }
  };

  // Actions for users
  const makeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/make-admin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.map((u) => (u._id === id ? { ...u, role: "admin" } : u)));
      alert("User promoted to admin");
    } catch (error) {
      console.error("Error making user admin:", error.response?.data || error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("pending")} className={activeTab === "pending" ? "active" : ""}>
          Pending Hotels
        </button>
        <button onClick={() => setActiveTab("approved")} className={activeTab === "approved" ? "active" : ""}>
          Approved Hotels
        </button>
        <button onClick={() => setActiveTab("users")} className={activeTab === "users" ? "active" : ""}>
          Users
        </button>
        <button onClick={() => setActiveTab("bookings")} className={activeTab === "bookings" ? "active" : ""}>
          Bookings
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === "pending" && (
              <div>
                <h2>Pending Hotels</h2>
                {data.length === 0 ? (
                  <p>No pending hotels.</p>
                ) : (
                  data.map((hotel) => (
                    <div key={hotel._id} className="card">
                      <h3>{hotel.name}</h3>
                      <p>{hotel.description}</p>
                      <div className="image-container">
                        {hotel.images && hotel.images.map((img, index) => (
                          <img
                            key={index}
                            className="thumbnail"
                            src={`http://localhost:5000/${img}`}
                            alt="Hotel Thumbnail"
                            onClick={() => setSelectedImage(`http://localhost:5000/uploads/${img}`)}
                          />
                        ))}
                      </div>
                      <div className="actions">
                        <button className="btn-approve" onClick={() => approveHotel(hotel._id)}>Approve</button>
                        <button className="btn-disapprove" onClick={() => disapproveHotel(hotel._id)}>Disapprove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeTab === "approved" && (
              <div>
                <h2>Approved Hotels</h2>
                {data.length === 0 ? (
                  <p>No approved hotels.</p>
                ) : (
                  data.map((hotel) => (
                    <div key={hotel._id} className="card">
                      <h3>{hotel.name}</h3>
                      <p>{hotel.description}</p>
                      <div className="actions">
                        <button className="btn-delete" onClick={() => deleteApprovedHotel(hotel._id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2>Users</h2>
                {data.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  <table className="user-list">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            {user.role !== "admin" && (
                              <button className="btn-admin" onClick={() => makeAdmin(user._id)}>Make Admin</button>
                            )}
                            <button className="btn-delete" onClick={() => deleteUser(user._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === "bookings" && (
              <div>
                <h2>Bookings</h2>
                {data.length === 0 ? (
                  <p>No bookings found.</p>
                ) : (
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Hotel</th>
                        <th>Location</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Amount Paid</th>
                        <th>Payment ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((booking, index) => (
                        <tr key={booking._id}>
                          <td>{index + 1}</td>
                          <td>{booking.hotel?.name || "N/A"}</td>
                          <td>{booking.hotel?.location || "N/A"}</td>
                          <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                          <td>{booking.name}</td>
                          <td>{booking.mobile}</td>
                          <td>{booking.email}</td>
                          <td>${(booking.amount / 100).toFixed(2)}</td>
                          <td>{booking.paymentId}</td>
                          <td>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full View" />
            <button className="modal-close" onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
