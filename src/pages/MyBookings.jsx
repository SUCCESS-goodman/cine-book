import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserBookings, deleteBooking } from "../services/firestore.js";

// Helper function to format dates (handles both string and Firestore Timestamp)
const formatDate = (dateValue) => {
    if (!dateValue) return "";
    const dateObj = dateValue?.toDate?.() || new Date(dateValue);
    return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
};

// Helper to format time
const formatTime = (timeValue) => {
    if (!timeValue) return "";
    return timeValue;
};

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) {
            return;
        }

        try {
            await deleteBooking(bookingId);
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            alert("Booking deleted successfully!");
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking. Please try again.");
        }
    };

    useEffect(() => {
        const loadBookings = async () => {
            if (!user) {
                console.log("NO USER - Not loading bookings");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("FETCHING BOOKINGS FOR UID:", user.uid);
                const firestoreBookings = await getUserBookings(user.uid);
                console.log("FIRESTORE BOOKINGS:", firestoreBookings);
                setBookings(firestoreBookings);
            } catch (error) {
                console.error("Error loading bookings:", error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, [user]);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                color: "#fff"
            }}>
                Loading your bookings...
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div style={{
                maxWidth: 600,
                margin: "0 auto",
                padding: "60px 20px",
                textAlign: "center"
            }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                    My Bookings
                </h1>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
                    You haven't booked any movies yet.
                </p>
                <Link to="/movies">
                    <button style={{
                        padding: "14px 28px",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: "pointer"
                    }}>
                        Browse Movies
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, color: "#fff" }}>
                My Bookings
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {bookings.map((booking) => (
                    <div key={booking.id} style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        padding: 20,
                        display: "flex",
                        gap: 20,
                        alignItems: "center"
                    }}>
                        <img
                            src={booking.poster}
                            alt={booking.movieTitle || booking.title}
                            style={{ width: 80, height: 120, objectFit: "cover", borderRadius: 8 }}
                        />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#fff" }}>
                                {booking.movieTitle || booking.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                                📅 {formatDate(booking.date)} at {formatTime(booking.time)}
                            </p>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                                🎟️ Seats: {Array.isArray(booking.seats) ? booking.seats.map(s => s.id || s).join(", ") : booking.seats}
                            </p>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                                📍 Theatre: {booking.theatreName}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                background: "rgba(167, 139, 250, 0.2)",
                                color: "#a78bfa",
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                marginBottom: 8
                            }}>
                                Rs. {(booking.totalAmount || booking.totalPrice || 0).toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                style={{
                                    display: "block",
                                    marginTop: 8,
                                    padding: "6px 12px",
                                    background: "rgba(239,68,68,0.2)",
                                    border: "1px solid #ef4444",
                                    color: "#ef4444",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    fontSize: 12,
                                    width: "100%"
                                }}
                            >
                                🗑️ Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
