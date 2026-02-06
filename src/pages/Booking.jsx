import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMovieById, createBooking, getAllTheatres, getUserBookings, deleteBooking } from "../services/firestore.js";
import "./Booking.css";

// Sample fallback theatres
const fallbackTheatres = [
    { id: "theatre_1", name: "Grand Cinema", location: "Downtown" },
    { id: "theatre_2", name: "City Plex", location: "Mall Road" },
    { id: "theatre_3", name: "IMAX Arena", location: "Tech Park" }
];

// Sample movie data fallback
const sampleMovies = {
    "movie_1": { id: "movie_1", title: "Avengers: Endgame", poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4, duration: "3h 01m" },
    "movie_2": { id: "movie_2", title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, duration: "2h 49m" },
    "movie_3": { id: "movie_3", title: "Inception", poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", rating: 8.8, duration: "2h 28m" },
    "movie_4": { id: "movie_4", title: "The Dark Knight", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, duration: "2h 32m" },
    "movie_5": { id: "movie_5", title: "Joker", poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", rating: 8.5, duration: "2h 02m" },
    "movie_6": { id: "movie_6", title: "Avatar", poster: "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg", rating: 7.9, duration: "2h 42m" },
    "movie_7": { id: "movie_7", title: "Titanic", poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", rating: 7.8, duration: "3h 15m" },
    "movie_8": { id: "movie_8", title: "Gladiator", poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", rating: 8.5, duration: "2h 35m" },
    "movie_9": { id: "movie_9", title: "The Matrix", poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, duration: "2h 16m" },
    "movie_10": { id: "movie_10", title: "Forrest Gump", poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", rating: 8.8, duration: "2h 22m" },
    "movie_11": { id: "movie_11", title: "The Shawshank Redemption", poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", rating: 9.3, duration: "2h 22m" },
    "movie_12": { id: "movie_12", title: "Fight Club", poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg", rating: 8.8, duration: "2h 19m" },
    "movie_13": { id: "movie_13", title: "Pulp Fiction", poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, duration: "2h 34m" },
    "movie_14": { id: "movie_14", title: "The Godfather", poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", rating: 9.2, duration: "2h 55m" },
    "movie_15": { id: "movie_15", title: "Doctor Strange", poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg", rating: 7.5, duration: "1h 55m" },
    "movie_16": { id: "movie_16", title: "Black Panther", poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", rating: 7.3, duration: "2h 14m" },
    "movie_17": { id: "movie_17", title: "Iron Man", poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", rating: 7.9, duration: "2h 06m" },
    "movie_18": { id: "movie_18", title: "Spider-Man: No Way Home", poster: "https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg", rating: 8.2, duration: "2h 28m" },
    "movie_19": { id: "movie_19", title: "Dune", poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", rating: 8.0, duration: "2h 35m" },
    "movie_20": { id: "movie_20", title: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg", rating: 8.6, duration: "3h 00m" },
    "movie_21": { id: "movie_21", title: "Barbie", poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", rating: 7.0, duration: "1h 54m" },
    "movie_22": { id: "movie_22", title: "The Batman", poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", rating: 7.9, duration: "2h 56m" },
    "movie_23": { id: "movie_23", title: "Mad Max: Fury Road", poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", rating: 8.1, duration: "2h 00m" },
    "movie_24": { id: "movie_24", title: "John Wick", poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg", rating: 7.4, duration: "1h 41m" },
    "movie_25": { id: "movie_25", title: "Parasite", poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", rating: 8.5, duration: "2h 12m" }
};

// Generate seats - all available
const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
            let price = 1000;

            // Front rows (A, B, C) = Rs. 1500
            if (row === "A" || row === "B" || row === "C") {
                price = 1500;
            }
            // Middle rows (D, E) = Rs. 1200
            else if (row === "D" || row === "E") {
                price = 1200;
            }
            // Back row (F) = Rs. 1000
            else {
                price = 1000;
            }

            seats.push({
                id: `${row}${i}`,
                row,
                number: i,
                isBooked: false,
                price: price // Prices in NPR
            });
        }
    });

    // Debug: log sample prices
    console.log("Generated seats - Sample A1:", seats[0]?.price, "F1:", seats[60]?.price);
    return seats;
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

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

const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationData, setConfirmationData] = useState(null);

    const showtimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Reset state when movie changes
            setMovie(null);
            setSelectedSeats([]);
            setBookingSuccess(false);
            setShowConfirmationModal(false);
            setConfirmationData(null);

            // Set default date and time immediately
            const dates = getAvailableDates();
            setSelectedDate(dates[0]);
            setSelectedTime(showtimes[2]);

            // Load theatres immediately with fallback
            try {
                const theatresData = await getAllTheatres();
                if (theatresData && theatresData.length > 0) {
                    setTheatres(theatresData);
                    setSelectedTheatre(theatresData[0].id);
                } else {
                    setTheatres(fallbackTheatres);
                    setSelectedTheatre(fallbackTheatres[0].id);
                }
            } catch (e) {
                console.warn("Error loading theatres:", e);
                setTheatres(fallbackTheatres);
                setSelectedTheatre(fallbackTheatres[0].id);
            }

            // Load seats
            setSeats(generateSeats());

            // Load movie
            try {
                const movieData = await getMovieById(id);
                if (movieData) {
                    const formattedMovie = {
                        id: movieData.id,
                        title: movieData.title,
                        poster: movieData.image || movieData.poster,
                        rating: movieData.rating,
                        duration: formatDuration(movieData.duration),
                        synopsis: movieData.synopsis,
                        genre: Array.isArray(movieData.genre) ? movieData.genre.join(", ") : movieData.genre
                    };
                    setMovie(formattedMovie);
                } else if (sampleMovies[id]) {
                    // Use sample movie from fallback
                    const sampleMovie = sampleMovies[id];
                    const formattedSampleMovie = {
                        id: sampleMovie.id,
                        title: sampleMovie.title,
                        poster: sampleMovie.poster,
                        rating: sampleMovie.rating,
                        duration: sampleMovie.duration,
                        synopsis: "",
                        genre: ""
                    };
                    setMovie(formattedSampleMovie);
                } else {
                    console.warn("Movie not found:", id);
                    setMovie(null);
                }
            } catch (e) {
                console.warn("Error loading movie:", e);
                if (sampleMovies[id]) {
                    const sampleMovie = sampleMovies[id];
                    setMovie({
                        id: sampleMovie.id,
                        title: sampleMovie.title,
                        poster: sampleMovie.poster,
                        rating: sampleMovie.rating,
                        duration: sampleMovie.duration,
                        synopsis: "",
                        genre: ""
                    });
                } else {
                    setMovie(null);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [id]);

    // Fetch user's bookings for this movie
    useEffect(() => {
        const loadUserBookings = async () => {
            if (!user) return;

            try {
                const allBookings = await getUserBookings(user.uid);
                // Filter bookings for this movie
                const movieBookings = allBookings.filter(b => b.movieId === id);
                setUserBookings(movieBookings);
            } catch (error) {
                console.warn("Error loading user bookings:", error);
            }
        };

        loadUserBookings();
    }, [user, id]);

    const toggleSeat = (seatId) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const calculateTotal = () => {
        const total = selectedSeats.reduce((sum, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            return sum + (seat?.price || 0);
        }, 0);
        console.log("CalculateTotal:", { selectedSeats, total, samplePrices: seats.slice(0, 3).map(s => ({ id: s.id, price: s.price })) });
        return total;
    };

    const handleBooking = async () => {
        console.log("BOOKING BUTTON CLICKED");

        if (!user) {
            console.log("NO USER - Redirecting to login");
            navigate("/login");
            return;
        }

        if (selectedSeats.length === 0) {
            console.log("NO SEATS SELECTED");
            alert("Please select at least one seat");
            return;
        }

        setBookingLoading(true);

        try {
            const seatDetails = selectedSeats.map(seatId => {
                const seat = seats.find(s => s.id === seatId);
                console.log("SEAT:", seatId, "- Price:", seat?.price, "- Row:", seat?.row);
                return {
                    id: seatId,
                    row: seat.row,
                    number: seat.number,
                    price: seat.price
                };
            });

            const theatre = theatres.find(t => t.id === selectedTheatre);

            const booking = {
                movieId: movie.id,
                movieTitle: movie.title,
                poster: movie.poster,
                date: selectedDate,
                time: selectedTime,
                seats: seatDetails,
                totalAmount: calculateTotal(),
                userId: user.uid,
                userEmail: user.email,
                theatreId: selectedTheatre,
                theatreName: theatre?.name || "N/A",
                theatreLocation: theatre?.location || "",
                status: "confirmed"
            };

            console.log("SEAT DETAILS BEING SAVED:", seatDetails);
            console.log("TOTAL AMOUNT CALCULATED:", calculateTotal());
            console.log("SAVING BOOKING:", booking);

            const savedBooking = await createBooking(booking);

            console.log("BOOKING SAVED ✅", savedBooking);

            // Update UI instantly with the saved booking
            setUserBookings(prev => [...prev, savedBooking]);

            // Set confirmation data and show modal
            setConfirmationData({
                movie: movie,
                theatre: theatre?.name || "N/A",
                location: theatre?.location || "",
                date: selectedDate,
                time: selectedTime,
                seats: selectedSeats.join(", "),
                totalAmount: calculateTotal()
            });
            setShowConfirmationModal(true);
        } catch (error) {
            console.error("BOOKING FAILED ❌", error);
            alert("Failed to complete booking. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    const closeModal = () => {
        setShowConfirmationModal(false);
        setConfirmationData(null);
        setBookingSuccess(true);
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) {
            return;
        }

        try {
            await deleteBooking(bookingId);
            setUserBookings(prev => prev.filter(b => b.id !== bookingId));
            alert("Booking deleted successfully!");
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Failed to delete booking. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="booking-loading">
                <div className="streamx-loader"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="booking-not-found">
                <h1 style={{ color: "#fff", marginBottom: 16 }}>Movie not found</h1>
                <Link to="/movies">
                    <button className="streamx-btn streamx-btn-primary">
                        Back to Movies
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <Link to={`/movies/${id}`} className="booking-back-link">
                ← Back to Movie Details
            </Link>

            <h1 className="booking-title">
                Book Tickets - {movie.title}
            </h1>

            {/* Show user's previous bookings for this movie */}
            {user && userBookings.length > 0 && (
                <div className="user-bookings-section">
                    <h3 className="user-bookings-title">
                        🎬 Your Previous Bookings for {movie.title}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {userBookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <div className="booking-item-info">
                                    <p>📅 {formatDate(booking.date)} at {booking.time}</p>
                                    <p>🎟️ Seats: {Array.isArray(booking.seats) ? booking.seats.map(s => s.id || s).join(", ") : booking.seats}</p>
                                    <p>📍 {booking.theatreName}</p>
                                    <p>💰 Total: Rs. {booking.totalAmount?.toLocaleString() || 0}</p>
                                </div>
                                <div className="booking-item-actions">
                                    <span className={`booking-status ${booking.status}`}>
                                        {booking.status}
                                    </span>
                                    <button
                                        className="delete-booking-btn"
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        title="Delete Booking"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {bookingSuccess && (
                <div className="booking-success">
                    <div className="booking-success-icon">🎉</div>
                    <h2>Booking Successful!</h2>
                    <p>Your tickets have been booked successfully.</p>
                    <div className="booking-success-details">
                        Theatre: {theatres.find(t => t.id === selectedTheatre)?.name}<br />
                        Date: {formatDate(selectedDate)}<br />
                        Time: {selectedTime}<br />
                        Seats: {selectedSeats.join(", ")}
                    </div>
                    <div className="booking-success-buttons">
                        <Link to="/bookings">
                            <button className="streamx-btn streamx-btn-primary">
                                View My Bookings
                            </button>
                        </Link>
                        <Link to="/movies">
                            <button className="streamx-btn streamx-btn-secondary">
                                Book More Tickets
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && confirmationData && (
                <div className="confirmation-modal-overlay" onClick={closeModal}>
                    <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirmation-modal-header">
                            <span className="confirmation-icon">🎉</span>
                            <h2>Booking Confirmed!</h2>
                        </div>
                        <div className="confirmation-modal-body">
                            <div className="confirmation-movie">
                                <img src={confirmationData.movie.poster} alt={confirmationData.movie.title} />
                                <div>
                                    <h3>{confirmationData.movie.title}</h3>
                                    <p>⭐ {confirmationData.movie.rating} • {confirmationData.movie.duration}</p>
                                </div>
                            </div>
                            <div className="confirmation-details">
                                <div className="confirmation-row">
                                    <span className="confirmation-label">🎭 Theatre</span>
                                    <span className="confirmation-value">{confirmationData.theatre}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="confirmation-label">📅 Date</span>
                                    <span className="confirmation-value">{formatDate(confirmationData.date)}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="confirmation-label">⏰ Time</span>
                                    <span className="confirmation-value">{confirmationData.time}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span className="confirmation-label">🎟️ Seats</span>
                                    <span className="confirmation-value">{confirmationData.seats}</span>
                                </div>
                                <div className="confirmation-row total">
                                    <span className="confirmation-label">💰 Total</span>
                                    <span className="confirmation-value">Rs. {confirmationData.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="confirmation-modal-footer">
                            <Link to="/bookings">
                                <button className="streamx-btn streamx-btn-primary">
                                    View My Bookings
                                </button>
                            </Link>
                            <button className="streamx-btn streamx-btn-secondary" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!bookingSuccess && (
                <div className="booking-grid">
                    <div>
                        <div className="movie-info">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-details">
                                <h3>{movie.title}</h3>
                                <p className="movie-meta">⭐ {movie.rating} • {movie.duration}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Theatre</label>
                            {theatres.length > 0 ? (
                                <select
                                    value={selectedTheatre}
                                    onChange={(e) => setSelectedTheatre(e.target.value)}
                                    className="form-select"
                                >
                                    {theatres.map(theatre => (
                                        <option key={theatre.id} value={theatre.id}>
                                            {theatre.name} - {theatre.location}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>No theatres available</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Date</label>
                            <div className="date-selector">
                                {getAvailableDates().map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                                    >
                                        {formatDate(date)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Time</label>
                            <div className="time-selector">
                                {showtimes.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Seats ({selectedSeats.length} selected)</label>
                            <div className="seat-selector">
                                {seats.map((seat) => (
                                    <button
                                        key={seat.id}
                                        onClick={() => !seat.isBooked && toggleSeat(seat.id)}
                                        disabled={seat.isBooked}
                                        title={`Row ${seat.row}, Seat ${seat.number} - Rs. ${seat.price}`}
                                        className={`seat-btn ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                                    >
                                        {seat.row}{seat.number}
                                    </button>
                                ))}
                            </div>
                            <div className="seat-legend">
                                <div className="legend-item">
                                    <div className="legend-box available"></div>
                                    <span>Available</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box selected"></div>
                                    <span>Selected</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box booked"></div>
                                    <span>Booked</span>
                                </div>
                            </div>
                        </div>

                        <div className="price-summary">
                            <h3>Price Summary</h3>
                            {selectedSeats.map(seatId => {
                                const seat = seats.find(s => s.id === seatId);
                                return (
                                    <div key={seatId} className="price-row">
                                        <span>Seat {seatId} (Row {seat?.row})</span>
                                        <span>Rs. {seat?.price?.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                            <div className="price-total">
                                <span>Total</span>
                                <span>Rs. {calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={bookingLoading || selectedSeats.length === 0}
                            className="book-btn"
                        >
                            {bookingLoading ? "Booking Complete" : `Book Now - Rs. ${calculateTotal().toLocaleString()}`}
                        </button>
                    </div>

                    <div className="seat-map-preview">
                        <h3>Screen</h3>
                        <div className="screen-indicator"></div>
                        <div className="seat-grid-preview">
                            {seats.slice(0, 72).map((seat) => (
                                <div
                                    key={seat.id}
                                    className={`seat-preview ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                                >
                                    {seat.row}{seat.number}
                                </div>
                            ))}
                        </div>
                        <p className="screen-label">Screen is this way ↑</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
