// src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch profile data using the userId stored in localStorage
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("UserId");
      // Use the new endpoint that requires userId as a parameter
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels listed by the user
  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users/my-hotels", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings made by the user
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "profile") {
      fetchProfile();
    } else if (activeTab === "listings") {
      fetchListings();
    } else if (activeTab === "bookings") {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>
          Profile
        </button>
        <button onClick={() => setActiveTab("listings")} className={activeTab === "listings" ? "active" : ""}>
          My Listings
        </button>
        <button onClick={() => setActiveTab("bookings")} className={activeTab === "bookings" ? "active" : ""}>
          My Bookings
        </button>
      </div>

      <div className="tab-content">
        {loading && <p>Loading...</p>}
        {activeTab === "profile" && profile && (
          <div className="profile-details">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Contact:</strong> {profile.contact}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="listings-details">
            <h2>My Hotel Listings</h2>
            {listings.length === 0 ? (
              <p>No hotel listings found.</p>
            ) : (
              <ul className="listings-list">
                {listings.map((hotel) => (
                  <li key={hotel._id}>
                    <h3>{hotel.name}</h3>
                    <p><strong>Location:</strong> {hotel.location}</p>
                    <p>{hotel.description.substring(0, 100)}...</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-details">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <ul className="bookings-list">
                {bookings.map((booking) => (
                  <li key={booking._id}>
                    <h3>{booking.hotel?.name || "Hotel"}</h3>
                    <p>
                      <strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}{" "}
                      | <strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p><strong>Amount Paid:</strong> ${(booking.amount / 100).toFixed(2)}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
