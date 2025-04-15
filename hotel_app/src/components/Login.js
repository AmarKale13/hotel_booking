import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const {login}=useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Move inside the component

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });  // Debug log
  
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.status === 200) {
        login(response.data.token);
        alert('Login successful!');
        
        navigate('/'); // Redirect to home page after login
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed. Please check your email and password.');
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/signup">Sign Up</Link> {/* ✅ Fix casing */}
        </p>
      </div>
    </div>
  );
};

export default Login;
