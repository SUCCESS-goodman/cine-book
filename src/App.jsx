// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import ErrorBoundary from "./assets/components/ErrorBoundary";
import { ProtectedRoute } from "./assets/components/ProtectedRoute";
import Navbar from "./components/AppNavbar.jsx";


import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MoviesDetails from "./pages/MoviesDetails.jsx";
import Booking from "./pages/Booking.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import NotFound from "./pages/NotFound.jsx";

import { seedFirestore } from "./seed/seedMovies";


const App = () => {
  // Commented out auto-seeding to prevent Firebase quota issues
  // The app uses fallback sample movies when Firestore is empty
  // To seed movies manually, run the seed function from console or create a seed button
  // useEffect(() => {
  //   seedFirestore();
  // }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/movies" element={
            <ProtectedRoute>
              <Movies key="movies-page" />
            </ProtectedRoute>
          } />
          <Route path="/movies/:id" element={
            <ProtectedRoute>
              <MoviesDetails />
            </ProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
