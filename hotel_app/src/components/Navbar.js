// src/components/Navbar.js
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown

  // Toggle dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents event bubbling to document
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Attach event listener when dropdown is open
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <li id="heading">
        <Link to="/">Immortal Hotels</Link>
      </li>
      <li>
        <span className="material-symbols-outlined icon_style">hotel_class</span>
      </li>
      <ul id="lower">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <ul id="upper">
        <li id="List-property" style={{ background: "none", marginTop: "10px" }}>
          <Link to="/Listing_Property">List Your Property</Link>
        </li>
        {isAuthenticated ? (
          <li className="dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="dropdown-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile">View Profile</Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="logout-btn"
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
