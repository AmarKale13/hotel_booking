// src/components/HomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";
import { generateRating } from "./generateRating";

const ratingRanges = [
  { label: "0 - 1", min: 0, max: 1 },
  { label: "1 - 2", min: 1, max: 2 },
  { label: "2 - 3", min: 2, max: 3 },
  { label: "3 - 4", min: 3, max: 4 },
  { label: "4 - 5", min: 4, max: 5 }
];

const availableAmenities = ["Sea View", "Cafe", "Pool", "Gym"]; // Modify as needed

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  // For rating, we'll store an array of selected range labels (e.g., ["1 - 2", "2 - 3"])
  const [selectedRatings, setSelectedRatings] = useState([]);
  // For amenities, store an array of selected amenity strings
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const fetchApprovedHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/hotels/approved");
      console.log("Fetched hotels:", response.data);
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching approved hotels:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedHotels();
  }, []);

  // Filter hotels by search term, price range, rating, and amenities.
  const filteredHotels = hotels.filter((hotel) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      hotel.name.toLowerCase().includes(term) ||
      hotel.location.toLowerCase().includes(term);
      
    const price = parseFloat(hotel.pricePerNight);
    const matchesPrice = price >= priceRange.min && price <= priceRange.max;
    
    const rating = parseFloat(generateRating(hotel._id));
    let matchesRating = true;
    if (selectedRatings.length > 0) {
      // Check if the hotel's rating falls within any of the selected ranges
      matchesRating = selectedRatings.some((rangeLabel) => {
        const range = ratingRanges.find(r => r.label === rangeLabel);
        return range && rating >= range.min && rating < range.max;
      });
    }
    
    let matchesAmenities = true;
    if (selectedAmenities.length > 0) {
      // Check if hotel amenities include ALL selected amenities (or use some if you prefer)
      const hotelAmenities = hotel.amenities.map(a => a.toLowerCase());
      matchesAmenities = selectedAmenities.every(
        (amenity) => hotelAmenities.includes(amenity.toLowerCase())
      );
    }
    
    return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prevRange => ({ ...prevRange, [name]: Number(value) }));
  };

  const handleRatingCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRatings(prev => [...prev, value]);
    } else {
      setSelectedRatings(prev => prev.filter(item => item !== value));
    }
  };

  const handleAmenityCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAmenities(prev => [...prev, value]);
    } else {
      setSelectedAmenities(prev => prev.filter(item => item !== value));
    }
  };

  return (
    <div className="homepage-container">
      {/* Search bar at the top */}
      <div className="search-bar-top">
        <input
          type="text"
          placeholder="Search hotels by name or location..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Content wrapper with sidebar and hotel grid */}
      <div className="content-wrapper">
        {/* Sidebar for filters */}
        <aside className="sidebar">
          <h2>Filters</h2>
          <div className="filter-group">
            <label htmlFor="min">Min Price (₹):</label>
            <input 
              type="number" 
              id="min" 
              name="min" 
              value={priceRange.min} 
              onChange={handlePriceChange} 
              min="0" 
            />
          </div>
          <div className="filter-group">
            <label htmlFor="max">Max Price (₹):</label>
            <input 
              type="number" 
              id="max" 
              name="max" 
              value={priceRange.max} 
              onChange={handlePriceChange} 
              min="0" 
            />
            <br></br>
            <hr></hr>
          </div>
          <div className="filter-group">
            <label>Rating:</label>
            <div className="checkbox-group">
              {ratingRanges.map((range) => (
                <label key={range.label}>
                  {range.label}
                  <input 
                    type="checkbox" 
                    value={range.label}
                    onChange={handleRatingCheckbox}
                    checked={selectedRatings.includes(range.label)}
                  />
                </label>
              ))}
            </div>
            <hr></hr>
          </div>
          <div className="filter-group">
            <label>Amenities:</label>
            <div className="checkbox-group">
              {availableAmenities.map((amenity) => (
                <label key={amenity}>
                  <input 
                    type="checkbox" 
                    value={amenity} 
                    onChange={handleAmenityCheckbox}
                    checked={selectedAmenities.includes(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content: Hotel Grid */}
        <main className="hotel-grid-container">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : (
            filteredHotels.length === 0 ? (
              <p className="no-hotels">No hotels match the current filters.</p>
            ) : (
              <div className="hotel-grid">
                {filteredHotels.map((hotel) => (
                  <div key={hotel._id} className="hotel-card">
                    <div className="hotel-image-container">
                      {hotel.images && hotel.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000/${hotel.images[0]}`}
                          alt={hotel.name}
                          className="hotel-image"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="hotel-info">
                      <h3 className="hotel-name">{hotel.name}</h3>
                      <p className="hotel-location">{hotel.location}</p>
                      <p className="hotel-description">{hotel.description}</p>
                      <p className="hotel-price">From ₹{hotel.pricePerNight} per night</p>
                      <p className="hotel-rating">Rating: {generateRating(hotel._id)} / 5</p>
                      <Link to={`/hotels/${hotel._id}`}>
                        <button className="view-details-btn">View Details</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
