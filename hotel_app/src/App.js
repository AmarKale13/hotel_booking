import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import './App.css';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel.js';
import { AuthContext } from "./AuthContext";
import Login from './components/Login.js';
import Signup from './components/SignUp.js';
import ListingProperty from './components/ListProperty';
import ProtectedRoute from './ProtectedRoute.js';
import HomePage from './components/Home.js';
import HotelDetails from './components/HotelDetails.js';
import Booking from './components/Booking.js';
import Profile from './components/Profile.js';
import PaymentSuccess from "./components/PaymentSuccess";
import About from './components/About.js';
import Services from './components/Services.js';

function App() {
  
  return (
    <Router>
      <Navbar />
      {/* <HotelList/> */}
      <Routes>
        <Route path="/" element={<h1><HomePage/></h1>} />
        <Route path="/hotels/:id" element={<h1><HotelDetails/></h1>} />
        <Route path="/about" element={<h1><About/></h1>} />
        <Route path="/services" element={<h1><Services/></h1>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<h1><Profile/></h1>} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/SignUp" element={<Signup/>} />
        <Route path="/Listing_Property" element={<ListingProperty/>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminPanel />} requiredRole="admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
