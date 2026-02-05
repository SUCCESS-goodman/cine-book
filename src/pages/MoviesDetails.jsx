import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";

// Helper function to convert YouTube URL to embed format
const getEmbedUrl = (url) => {
    if (!url) return null;
    // If already an embed URL, return as is
    if (url.includes("embed")) return url;
    // Convert regular YouTube URL to embed format
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

// Fallback image for broken posters
const FALLBACK_IMAGE = "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg";

const MoviesDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const movieDoc = await getDoc(doc(db, "movies", id));

                if (movieDoc.exists()) {
                    const movieData = movieDoc.data();
                    // Map Firestore data to component format
                    const formattedMovie = {
                        id: movieDoc.id,
                        title: movieData.title,
                        image: movieData.image || movieData.poster || FALLBACK_IMAGE,
                        rating: movieData.rating,
                        genre: Array.isArray(movieData.genre) ? movieData.genre.join(", ") : movieData.genre,
                        duration: formatDuration(movieData.duration),
                        director: "N/A", // Firestore data doesn't have director field
                        description: movieData.synopsis || movieData.description,
                        trailer: getEmbedUrl(movieData.trailer)
                    };
                    setMovie(formattedMovie);
                } else {
                    // Fallback to default movie if not found
                    setMovie(null);
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const formatDuration = (minutes) => {
        if (typeof minutes === "string") return minutes; // Already formatted
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                color: "#fff"
            }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Movie not found</h2>
                    <Link to="/movies" style={{ color: "#a78bfa", textDecoration: "none" }}>
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 20px"
        }}>
            <Link to="/movies" style={{ color: "#a78bfa", textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
                ← Back to Movies
            </Link>

            <div style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: 40
            }}>
                <img
                    src={movie.image}
                    alt={movie.title}
                    onError={handleImageError}
                    style={{
                        width: "100%",
                        borderRadius: 12,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                    }}
                />

                <div>
                    <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                        {movie.title}
                    </h1>

                    <div style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 20,
                        color: "rgba(255,255,255,0.7)"
                    }}>
                        <span style={{ color: "#a78bfa" }}>⭐ {movie.rating}</span>
                        <span>•</span>
                        <span>{movie.genre}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                    </div>

                    <p style={{
                        fontSize: 16,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: 24
                    }}>
                        {movie.description}
                    </p>

                    <p style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: 32
                    }}>
                        <strong style={{ color: "rgba(255,255,255,0.9)" }}>Director:</strong> {movie.director}
                    </p>

                    {movie.trailer && (
                        <div style={{ marginBottom: 32 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "#fff" }}>
                                Trailer
                            </h3>
                            <iframe
                                src={movie.trailer}
                                title={`${movie.title} Trailer`}
                                width="100%"
                                height="400"
                                style={{ borderRadius: 12, border: "none" }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <Link to={`/booking/${movie.id}`}>
                        <button style={{
                            width: "100%",
                            maxWidth: 300,
                            padding: "16px 32px",
                            borderRadius: 10,
                            border: "none",
                            background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: "pointer"
                        }}>
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MoviesDetails;


