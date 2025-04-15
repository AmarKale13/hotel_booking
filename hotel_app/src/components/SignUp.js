import { Link,useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response=await axios.post('http://localhost:5000/api/auth/register',formData);
      if(response.data.success){
        alert('SignUp Successfull');
        navigate('/login');
      }
      else alert(response.data.message);
    }
    catch(error){
      alert('SignUp Failed: '+(error.response?.data?.message || error.message));
    }
  };


  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Number:</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signup-button">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
