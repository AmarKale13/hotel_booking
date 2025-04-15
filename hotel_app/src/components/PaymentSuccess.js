// src/components/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verify payment and get booking details
  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const hotelId = localStorage.getItem("hotelId");
        const userId = localStorage.getItem("UserId");
        const bookingData = JSON.parse(localStorage.getItem("bookingData"));
        const amount = localStorage.getItem("amount");

        const res = await axios.post("http://localhost:5000/api/verify-payment", {
          hotelId,
          userId,
          bookingData,
          amount,
          paymentId: sessionId, // or use the actual paymentId if available
          sessionId,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error verifying payment and creating booking:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  // Fetch hotel details separately if needed
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (booking && booking.hotel) {
        if (typeof booking.hotel === "string") {
          try {
            const res = await axios.get(`http://localhost:5000/api/hotels/${booking.hotel}`);
            setHotelData(res.data);
          } catch (error) {
            console.error("Error fetching hotel details:", error.response?.data || error.message);
          }
        } else {
          setHotelData(booking.hotel);
        }
      }
    };

    fetchHotelDetails();
  }, [booking]);

  // Function to generate and download PDF bill
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Booking Bill", 14, 22);
    doc.setFontSize(12);
    doc.text(`Hotel: ${hotelData.name}`, 14, 32);
    doc.text(`Location: ${hotelData.location}`, 14, 40);
    doc.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`, 14, 48);
    doc.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, 14, 56);
    doc.text(`Name: ${booking.name}`, 14, 64);
    doc.text(`Mobile: ${booking.mobile}`, 14, 72);
    doc.text(`Email: ${booking.email}`, 14, 80);
    doc.text(`Amount Paid: $${(booking.amount / 100).toFixed(2)}`, 14, 88);
    doc.text(`Payment ID: ${booking.paymentId}`, 14, 96);
    
    // Optionally, you can add a table with more details using autotable:
    // doc.autoTable({ startY: 105, head: [['Field', 'Value']], body: [
    //   ['Hotel', hotelData.name],
    //   ['Location', hotelData.location],
    //   // add more fields if needed
    // ]});
    
    // Save the PDF with a given name
    doc.save("booking_bill.pdf");
  };

  if (loading) return <div className="loading">Loading booking details...</div>;
  if (!booking) return <div className="error">Booking not found.</div>;
  if (!hotelData) return <div className="loading">Loading hotel details...</div>;

  return (
    <div className="payment-success-container">
      <h1>Payment Successful!</h1>
      <div className="booking-summary">
        <h2>Booking Summary</h2>
        <p><strong>Hotel:</strong> {hotelData.name}</p>
        <p><strong>Location:</strong> {hotelData.location}</p>
        <p><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Name:</strong> {booking.name}</p>
        <p><strong>Mobile:</strong> {booking.mobile}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Amount Paid:</strong> ${(booking.amount / 100).toFixed(2)}</p>
        <p><strong>Payment ID:</strong> {booking.paymentId}</p>
      </div>
      <div className="print-bill">
        <button onClick={handleDownloadPDF}>Download Bill</button>
      </div>

      <div className="back-to-home">
        <p>Thank you for your booking! You can now go back to the home page.</p>
        <button onClick={() => window.location.href = '/'}>Back to Home</button>
        </div>
      
    </div>
  );
};

export default PaymentSuccess;
