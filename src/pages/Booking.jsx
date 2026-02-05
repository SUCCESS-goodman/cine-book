import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
            seats.push({
                id: `${row}${i}`,
                row,
                number: i,
                isBooked: false,
                price: row <= "C" ? 15 : row <= "E" ? 12 : 10
            });
        }
    });
    return seats;
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

// Lazy load firestore to avoid startup errors
let getMovieById = null;
let createBooking = null;
let getAllTheatres = null;
let getUserBookings = null;

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

    const showtimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];

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

    // Lazy import firestore functions
    useEffect(() => {
        const loadFirestore = async () => {
            try {
                const firestore = await import("../services/firestore.js");
                getMovieById = firestore.getMovieById;
                createBooking = firestore.createBooking;
                getAllTheatres = firestore.getAllTheatres;
                getUserBookings = firestore.getUserBookings;
            } catch (error) {
                console.warn("Firestore not available, using fallback data");
            }
        };
        loadFirestore();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Set default date and time immediately
            const dates = getAvailableDates();
            setSelectedDate(dates[0]);
            setSelectedTime(showtimes[2]);

            // Load theatres immediately with fallback
            try {
                if (getAllTheatres) {
                    const theatresData = await getAllTheatres();
                    if (theatresData && theatresData.length > 0) {
                        setTheatres(theatresData);
                        setSelectedTheatre(theatresData[0].id);
                    } else {
                        setTheatres(fallbackTheatres);
                        setSelectedTheatre(fallbackTheatres[0].id);
                    }
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
                if (getMovieById) {
                    const movieData = await getMovieById(id);
                    if (movieData) {
                        const formattedMovie = {
                            id: movieData.id,
                            title: movieData.title,
                            poster: movieData.image,
                            rating: movieData.rating,
                            duration: formatDuration(movieData.duration),
                            synopsis: movieData.synopsis,
                            genre: Array.isArray(movieData.genre) ? movieData.genre.join(", ") : movieData.genre
                        };
                        setMovie(formattedMovie);
                    } else {
                        setMovie(sampleMovies[id] || sampleMovies["movie_1"]);
                    }
                } else {
                    setMovie(sampleMovies[id] || sampleMovies["movie_1"]);
                }
            } catch (e) {
                console.warn("Error loading movie:", e);
                setMovie(sampleMovies[id] || sampleMovies["movie_1"]);
            }

            setLoading(false);
        };

        loadData();
    }, [id]);

    // Fetch user's bookings for this movie
    useEffect(() => {
        const loadUserBookings = async () => {
            if (!user || !getUserBookings) return;

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
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            return total + (seat?.price || 0);
        }, 0);
    };

    const handleBooking = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }

        setBookingLoading(true);

        try {
            const seatDetails = selectedSeats.map(seatId => {
                const seat = seats.find(s => s.id === seatId);
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

            if (createBooking) {
                await createBooking(booking);

                // Refresh user bookings (separate try-catch to not affect main booking)
                try {
                    if (user && getUserBookings) {
                        const allBookings = await getUserBookings(user.uid);
                        const movieBookings = allBookings.filter(b => b.movieId === id);
                        setUserBookings(movieBookings);
                    }
                } catch (refreshError) {
                    console.warn("Could not refresh bookings:", refreshError);
                }
            }

            setBookingSuccess(true);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to complete booking. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                color: "#fff"
            }}>
                Loading...
            </div>
        );
    }

    if (!movie) {
        return (
            <div style={{
                maxWidth: 600,
                margin: "0 auto",
                padding: "60px 20px",
                textAlign: "center"
            }}>
                <h1 style={{ color: "#fff", marginBottom: 16 }}>Movie not found</h1>
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
                        Back to Movies
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
            <Link to={`/movies/${id}`} style={{ color: "#a78bfa", textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
                ← Back to Movie Details
            </Link>

            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: "#fff" }}>
                Book Tickets - {movie.title}
            </h1>

            {/* Show user's previous bookings for this movie */}
            {user && userBookings.length > 0 && (
                <div style={{
                    background: "rgba(167, 139, 250, 0.1)",
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 32
                }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#a78bfa" }}>
                        🎬 Your Previous Bookings for {movie.title}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {userBookings.map((booking, index) => (
                            <div key={index} style={{
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: 8,
                                padding: 16,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 12
                            }}>
                                <div>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                                        📅 {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {booking.time}
                                    </p>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                                        🎟️ Seats: {Array.isArray(booking.seats) ? booking.seats.map(s => s.id || s).join(", ") : booking.seats}
                                    </p>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                                        📍 {booking.theatreName}
                                    </p>
                                </div>
                                <span style={{
                                    padding: "6px 12px",
                                    background: booking.status === "confirmed" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                    color: booking.status === "confirmed" ? "#10b981" : "#ef4444",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: "capitalize"
                                }}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {bookingSuccess && (
                <div style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "2px solid #10b981",
                    borderRadius: 16,
                    padding: 40,
                    textAlign: "center",
                    marginBottom: 32
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ color: "#10b981", fontSize: 32, marginBottom: 16 }}>Booking Successful!</h2>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 8 }}>
                        Your tickets have been booked successfully.
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24 }}>
                        Theatre: {theatres.find(t => t.id === selectedTheatre)?.name}<br />
                        Date: {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}<br />
                        Time: {selectedTime}<br />
                        Seats: {selectedSeats.join(", ")}
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        <Link to="/bookings">
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
                                View My Bookings
                            </button>
                        </Link>
                        <Link to="/movies">
                            <button style={{
                                padding: "14px 28px",
                                borderRadius: 10,
                                border: "2px solid rgba(255,255,255,0.3)",
                                background: "transparent",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: "pointer"
                            }}>
                                Book More Tickets
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {!bookingSuccess && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                    <div>
                        <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={{ width: 80, borderRadius: 8 }}
                            />
                            <div>
                                <h3 style={{ color: "#fff", marginBottom: 8 }}>{movie.title}</h3>
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                                    ⭐ {movie.rating} • {movie.duration}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", color: "#fff", marginBottom: 8, fontWeight: 500 }}>
                                Select Theatre
                            </label>
                            {theatres.length > 0 ? (
                                <select
                                    value={selectedTheatre}
                                    onChange={(e) => setSelectedTheatre(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: 8,
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        background: "rgba(255,255,255,0.08)",
                                        color: "#fff",
                                        fontSize: 14,
                                        cursor: "pointer"
                                    }}
                                >
                                    {theatres.map(theatre => (
                                        <option key={theatre.id} value={theatre.id} style={{ background: "#1f2937", color: "#fff" }}>
                                            {theatre.name} - {theatre.location}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>No theatres available</p>
                            )}
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", color: "#fff", marginBottom: 8, fontWeight: 500 }}>
                                Select Date
                            </label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {getAvailableDates().map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            padding: "10px 16px",
                                            borderRadius: 8,
                                            border: selectedDate === date ? "2px solid #a78bfa" : "1px solid rgba(255,255,255,0.3)",
                                            background: selectedDate === date ? "rgba(167, 139, 250, 0.2)" : "rgba(255,255,255,0.08)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: 14
                                        }}
                                    >
                                        {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", color: "#fff", marginBottom: 8, fontWeight: 500 }}>
                                Select Time
                            </label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {showtimes.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: 8,
                                            border: selectedTime === time ? "2px solid #a78bfa" : "1px solid rgba(255,255,255,0.3)",
                                            background: selectedTime === time ? "rgba(167, 139, 250, 0.2)" : "rgba(255,255,255,0.08)",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: 14
                                        }}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", color: "#fff", marginBottom: 8, fontWeight: 500 }}>
                                Select Seats ({selectedSeats.length} selected)
                            </label>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(12, 1fr)",
                                gap: 4,
                                maxWidth: 400
                            }}>
                                {seats.map((seat) => (
                                    <button
                                        key={seat.id}
                                        onClick={() => !seat.isBooked && toggleSeat(seat.id)}
                                        disabled={seat.isBooked}
                                        title={`Row ${seat.row}, Seat ${seat.number} - $${seat.price}`}
                                        style={{
                                            padding: "8px 4px",
                                            borderRadius: 4,
                                            border: "none",
                                            background: seat.isBooked
                                                ? "rgba(239, 68, 68, 0.3)"
                                                : selectedSeats.includes(seat.id)
                                                    ? "#a78bfa"
                                                    : "rgba(16, 185, 129, 0.3)",
                                            color: seat.isBooked
                                                ? "rgba(239, 68, 68, 0.5)"
                                                : "#fff",
                                            cursor: seat.isBooked ? "not-allowed" : "pointer",
                                            fontSize: 10,
                                            fontWeight: 500
                                        }}
                                    >
                                        {seat.row}{seat.number}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(16, 185, 129, 0.3)" }}></div>
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Available</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "#a78bfa" }}></div>
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Selected</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(239, 68, 68, 0.3)" }}></div>
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Booked</span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 12,
                            padding: 20,
                            marginBottom: 24
                        }}>
                            <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 18 }}>Price Summary</h3>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ color: "rgba(255,255,255,0.7)" }}>Seats ({selectedSeats.length})</span>
                                <span style={{ color: "#fff" }}>${calculateTotal()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                                <span style={{ color: "#fff", fontWeight: 600 }}>Total</span>
                                <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: 20 }}>${calculateTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={bookingLoading || selectedSeats.length === 0}
                            style={{
                                width: "100%",
                                padding: "16px 32px",
                                borderRadius: 10,
                                border: "none",
                                background: selectedSeats.length === 0 ? "rgba(255,255,255,0.1)" : "linear-gradient(90deg,#7c3aed,#a78bfa)",
                                color: selectedSeats.length === 0 ? "rgba(255,255,255,0.3)" : "#fff",
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
                                opacity: bookingLoading ? 0.7 : 1
                            }}
                        >
                            {bookingLoading ? "Processing..." : `Book Now - $${calculateTotal()}`}
                        </button>
                    </div>

                    <div style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 16,
                        padding: 24,
                        position: "sticky",
                        top: 20
                    }}>
                        <h3 style={{ color: "#fff", marginBottom: 20, fontSize: 18 }}>Screen</h3>
                        <div style={{
                            height: 8,
                            background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)",
                            borderRadius: 4,
                            marginBottom: 32
                        }}></div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(12, 1fr)",
                            gap: 4
                        }}>
                            {seats.slice(0, 72).map((seat) => (
                                <div
                                    key={seat.id}
                                    style={{
                                        padding: "6px 2px",
                                        borderRadius: 4,
                                        textAlign: "center",
                                        fontSize: 9,
                                        background: seat.isBooked
                                            ? "rgba(239, 68, 68, 0.3)"
                                            : selectedSeats.includes(seat.id)
                                                ? "#a78bfa"
                                                : "rgba(16, 185, 129, 0.3)",
                                        color: seat.isBooked
                                            ? "rgba(239, 68, 68, 0.5)"
                                            : "#fff"
                                    }}
                                >
                                    {seat.row}{seat.number}
                                </div>
                            ))}
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textAlign: "center", marginTop: 16 }}>
                            Screen is this way ↑
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
