import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AppNavbar.css";

/**
 * AppNavbar Component
 * Displays the main navigation bar with:
 * - Logo and branding (CINE BOOK)
 * - Navigation links (Home, Movies, My Bookings)
 * - Search functionality
 * - User profile section (when logged in) or auth buttons (when logged out)
 */

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const MoviesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
  </svg>
);

const BookingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

export default function AppNavbar() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  // Navigation handlers
  function handleHome() { navigate("/"); }
  function handleMovies() { navigate("/movies"); }
  function handleMyBookings() { navigate("/bookings"); }
  function handleLogin() { navigate("/login"); }
  function handleRegister() { navigate("/register"); }

  // Logout handler - signs out user and redirects to login page
  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="streamx-navbar">
      <div className="navbar-left">
        {/* Logo */}
        <div className="streamx-logo" onClick={handleHome}>
          <div className="streamx-logo-icon">
            <PlayIcon />
          </div>
          <span className="streamx-logo-text">CINE BOOK</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            className={`nav-link ${window.location.pathname === '/' ? 'active' : ''}`}
            onClick={handleHome}
          >
            <HomeIcon />
            Home
          </button>
          <button
            className={`nav-link ${window.location.pathname === '/movies' ? 'active' : ''}`}
            onClick={handleMovies}
          >
            <MoviesIcon />
            Movies
          </button>
          <button
            className={`nav-link ${window.location.pathname === '/bookings' ? 'active' : ''}`}
            onClick={handleMyBookings}
          >
            <BookingsIcon />
            My Bookings
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {authLoading ? (
          <span className="loading-text">Loading…</span>
        ) : user ? (
          /* Logged in user section - shows avatar with first letter of email */
          <div className="user-profile-loggedin">
            <div className="user-avatar-gmail">
              {/* Shows only the first letter of the email (e.g., "S" for smith@gmail.com) */}
              <span className="gmail-avatar-text">{user.email?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <button className="logout-btn-visible" onClick={handleLogout}>
              <LogoutIcon />
              Sign Out
            </button>
          </div>
        ) : (
          /* Not logged in - show Sign In and Sign Up buttons */
          <div className="auth-buttons">
            <button className="nav-btn login-btn" onClick={handleLogin}>
              Sign In
            </button>
            <button className="nav-btn signup-btn" onClick={handleRegister}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
