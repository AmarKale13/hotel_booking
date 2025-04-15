// src/components/HotelDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HotelDetails.css";
import { generateRating } from "./generateRating";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hotels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [id, token]);

  if (loading) return <div className="loading">Loading hotel details...</div>;
  if (!hotel) return <div className="error">Hotel not found.</div>;

  const discountPercentage = 20;
  const discountedPrice = (hotel.pricePerNight * (100 - discountPercentage)) / 100;

  return (
    <div className="hotel-details-container">
      <div className="hotel-header">
        <div className="hotel-main-image">
          {hotel.images && hotel.images.length > 0 ? (
            <img src={`http://localhost:5000/${hotel.images[0]}`} alt={hotel.name} />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
        <div className="hotel-info-header">
          <h1>{hotel.name}</h1>
          <p className="hotel-location">{hotel.location}</p>
          <div className="price-section">
            <span className="original-price">${hotel.pricePerNight}</span>
            <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
            <span className="discount-label">Save {discountPercentage}%</span>
          </div>
          <p className="hotel-rating">Rating: {generateRating(hotel._id)} / 5</p>
          <div className="contact-info">
            <p>Contact Email: {hotel.contactEmail}</p>
            <p>Contact Number: {hotel.contactNumber}</p>
          </div>
          {/* View on Map Button */}
          <div className="map-link">
            <a href={hotel.mapLink} target="_blank" rel="noopener noreferrer">
              View on Map
            </a>
          </div>
          {/* Book Now Button */}
          <button 
            className="book-now-btn" 
            onClick={() => navigate(`/booking/${hotel._id}`)}
          >
            Book Now
          </button>
        </div>
      </div>
      
      <div className="hotel-description">
        <h2>Description</h2>
        <p>{hotel.description}</p>
      </div>
      
      <div className="hotel-amenities">
        <h2>Amenities</h2>
        {hotel.amenities && hotel.amenities.length > 0 ? (
          <ul>
            {hotel.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        ) : (
          <p>No amenities listed.</p>
        )}
      </div>

      <div className="hotel-images-gallery">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {hotel.images && hotel.images.length > 0 ? (
            hotel.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img}`}
                alt={`${hotel.name} ${index + 1}`}
                className="gallery-image"
              />
            ))
          ) : (
            <p>No additional images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
