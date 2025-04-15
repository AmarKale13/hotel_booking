// src/components/Booking.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams(); // hotel id
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    name: "",
    mobile: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const saveBookingDetailsToLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    // Save the necessary booking details
    localStorage.setItem("hotelId", id); // Save the hotel id from URL params
    // Assume you have userId stored after login; adjust as needed.
    localStorage.setItem("bookingUserName", bookingData.name); 
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    // Amount should be calculated or fixed (for example, in cents)
    localStorage.setItem("amount", 50000); // $500.00 = 50000 cents
  };

  // Function to trigger payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Save booking details into localStorage before payment initiation.
      saveBookingDetailsToLocalStorage();
      const amount = 50000; // Amount in cents
      const response = await axios.post(
        "http://localhost:5000/api/create-checkout-session",
        { amount, hotelId: id, bookingData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error in payment process:", error.response?.data || error.message);
      alert("Error initiating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, you can validate or save booking details locally
    alert("Booking details saved. Now proceed to payment.");
  };

  return (
    <div className="booking-container">
      <h2>Book Your Stay</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="date-row">
          <div className="date-group">
            <label htmlFor="checkInDate">Check-In Date:</label>
            <input
              type="date"
              name="checkInDate"
              id="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="date-group">
            <label htmlFor="checkOutDate">Check-Out Date:</label>
            <input
              type="date"
              name="checkOutDate"
              id="checkOutDate"
              value={bookingData.checkOutDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <label>
          Your Name:
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={bookingData.name}
            
            onChange={handleChange}
            required
          />
          
        </label>
        <label>
          Mobile Number:
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={bookingData.mobile}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={bookingData.email}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          Save Booking Details
        </button>
      </form>
      <button className="book-now-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Booking;
