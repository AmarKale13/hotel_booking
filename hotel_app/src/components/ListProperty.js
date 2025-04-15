// src/components/ListProperty.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ListProperty.css";

const ListProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    mapLink: '',
    description: '',
    pricePerNight: '',
    amenities: '',
    contactEmail: '',
    contactNumber: ''
  });
  const [images, setImages] = useState([]); // Array of File objects
  const [previewImages, setPreviewImages] = useState([]); // Array of preview URLs
  const navigate = useNavigate();

  // Update text and URL fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Updated formData:", { ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes. Merge new files with existing, but limit to 5 total.
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...images, ...newFiles].slice(0, 5);
    setImages(combinedFiles);

    // Generate preview URLs for all files.
    const previews = combinedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Clear the input value so the same file can be selected again if needed.
    e.target.value = "";
  };

  // Optional: Clear all selected images.
  const handleClearImages = () => {
    setImages([]);
    setPreviewImages([]);
  };

  // Submit the form data along with the images.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit a property.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("mapLink", formData.mapLink);
      data.append("description", formData.description);
      data.append("pricePerNight", formData.pricePerNight);
      data.append("amenities", formData.amenities);
      data.append("contactEmail", formData.contactEmail);
      data.append("contactNumber", formData.contactNumber);
      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await axios.post("http://localhost:5000/api/hotels/submit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error("Error submitting property:", error.response?.data || error.message);
    }
  };

  return (
    <div className="list-property-container">
      <h2>List Your Property</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="property-form">
        <input type="text" name="name" placeholder="Hotel Name" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Hotel Location" onChange={handleChange} required />
        <input type="url" name="mapLink" placeholder="Map URL (e.g., Google Maps link)" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
        <input type="number" name="pricePerNight" placeholder="Price Per Night" onChange={handleChange} required />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" onChange={handleChange} />
        <div className="contact-section">
          <input type="email" name="contactEmail" placeholder="Contact Email" onChange={handleChange} required />
          <input type="tel" name="contactNumber" placeholder="Contact Mobile Number" onChange={handleChange} required />
        </div>
        <div className="file-input-container">
          <label htmlFor="images">Attach Images (up to 5):</label>
          <input
            type="file"
            name="images"
            id="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          {images.length > 0 && (
            <button type="button" onClick={handleClearImages}>Clear Selected Images</button>
          )}
        </div>
        <div className="image-preview">
          {previewImages.map((img, index) => (
            <img key={index} src={img} alt={`Preview ${index + 1}`} />
          ))}
        </div>
        <button type="submit">Submit for Approval</button>
      </form>
    </div>
  );
};

export default ListProperty;
