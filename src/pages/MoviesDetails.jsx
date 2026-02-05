import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";

// Sample movies as fallback when Firestore is empty
const SAMPLE_MOVIES = [
    {
        id: "movie_1",
        title: "Avengers: Endgame",
        genre: ["Action", "Sci-Fi"],
        rating: 8.4,
        synopsis: "The Avengers assemble one last time to undo Thanos' destruction.",
        duration: 181,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        trailer: "https://www.youtube.com/embed/TcMBFSGVi1c"
    },
    {
        id: "movie_2",
        title: "Interstellar",
        genre: ["Sci-Fi", "Drama"],
        rating: 8.6,
        synopsis: "Explorers travel through a wormhole to save humanity.",
        duration: 169,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        trailer: "https://www.youtube.com/embed/zSWdZVtXT7E"
    },
    {
        id: "movie_3",
        title: "Inception",
        genre: ["Action", "Sci-Fi"],
        rating: 8.8,
        synopsis: "A thief enters dreams to steal secrets from the subconscious.",
        duration: 148,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
        trailer: "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
        id: "movie_4",
        title: "The Dark Knight",
        genre: ["Action", "Crime"],
        rating: 9.0,
        synopsis: "Batman faces the Joker in a battle for Gotham.",
        duration: 152,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        trailer: "https://www.youtube.com/embed/EXeTwQWrcwY"
    },
    {
        id: "movie_5",
        title: "Joker",
        genre: ["Drama", "Crime"],
        rating: 8.5,
        synopsis: "A failed comedian descends into madness.",
        duration: 122,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        trailer: "https://www.youtube.com/embed/zAGVQLHvwOY"
    },
    {
        id: "movie_6",
        title: "Avatar",
        genre: ["Fantasy", "Sci-Fi"],
        rating: 7.9,
        synopsis: "A marine bonds with an alien race on Pandora.",
        duration: 162,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg",
        trailer: "https://www.youtube.com/embed/5PSNL1qE6VY"
    },
    {
        id: "movie_7",
        title: "Titanic",
        genre: ["Drama", "Romance"],
        rating: 7.8,
        synopsis: "A love story aboard the doomed Titanic.",
        duration: 195,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
        trailer: "https://www.youtube.com/embed/kVrqfYjkTdQ"
    },
    {
        id: "movie_8",
        title: "Gladiator",
        genre: ["Action", "Drama"],
        rating: 8.5,
        synopsis: "A Roman general seeks revenge.",
        duration: 155,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
        trailer: "https://www.youtube.com/embed/owK1qxDselE"
    },
    {
        id: "movie_9",
        title: "The Matrix",
        genre: ["Action", "Sci-Fi"],
        rating: 8.7,
        synopsis: "A hacker learns reality is a simulation.",
        duration: 136,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        trailer: "https://www.youtube.com/embed/vKQi3bBA1y8"
    },
    {
        id: "movie_10",
        title: "Forrest Gump",
        genre: ["Drama", "Romance"],
        rating: 8.8,
        synopsis: "A simple man witnesses historic events.",
        duration: 142,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        trailer: "https://www.youtube.com/embed/bLvqoHBptjg"
    },
    {
        id: "movie_11",
        title: "The Shawshank Redemption",
        genre: ["Drama"],
        rating: 9.3,
        synopsis: "Hope inside a prison.",
        duration: 142,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        trailer: "https://www.youtube.com/embed/6hB3S9bIaco"
    },
    {
        id: "movie_12",
        title: "Fight Club",
        genre: ["Drama"],
        rating: 8.8,
        synopsis: "An underground fight club spirals.",
        duration: 139,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
        trailer: "https://www.youtube.com/embed/SUXWAEX2jlg"
    },
    {
        id: "movie_13",
        title: "Pulp Fiction",
        genre: ["Crime"],
        rating: 8.9,
        synopsis: "Interconnected crime stories.",
        duration: 154,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY"
    },
    {
        id: "movie_14",
        title: "The Godfather",
        genre: ["Crime"],
        rating: 9.2,
        synopsis: "The rise of a mafia dynasty.",
        duration: 175,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        trailer: "https://www.youtube.com/watch?v=sY1S34973zA"
    },
    {
        id: "movie_15",
        title: "Doctor Strange",
        genre: ["Action", "Fantasy"],
        rating: 7.5,
        synopsis: "A surgeon becomes a sorcerer.",
        duration: 115,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
        trailer: "https://www.youtube.com/embed/HSzx-zryEgM"
    },
    {
        id: "movie_16",
        title: "Black Panther",
        genre: ["Action"],
        rating: 7.3,
        synopsis: "Wakanda's king rises.",
        duration: 134,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
        trailer: "https://www.youtube.com/embed/xjDjIWPwcPU"
    },
    {
        id: "movie_17",
        title: "Iron Man",
        genre: ["Action"],
        rating: 7.9,
        synopsis: "A billionaire builds a suit.",
        duration: 126,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
        trailer: "https://www.youtube.com/embed/8ugaeA-nMTc"
    },
    {
        id: "movie_18",
        title: "Spider-Man: No Way Home",
        genre: ["Action"],
        rating: 8.2,
        synopsis: "Multiverse chaos erupts.",
        duration: 148,
        status: "coming_soon",
        image: "https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
        trailer: "https://www.youtube.com/embed/JfVOs4VSpmA"
    },
    {
        id: "movie_19",
        title: "Dune",
        genre: ["Sci-Fi"],
        rating: 8.0,
        synopsis: "A desert planet war.",
        duration: 155,
        status: "coming_soon",
        image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
        trailer: "https://www.youtube.com/embed/n9xhJrPXop4"
    },
    {
        id: "movie_20",
        title: "Oppenheimer",
        genre: ["Drama"],
        rating: 8.6,
        synopsis: "The father of the atomic bomb.",
        duration: 180,
        status: "coming_soon",
        image: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
        trailer: "https://www.youtube.com/embed/uYPbbksJxIg"
    },
    {
        id: "movie_21",
        title: "Barbie",
        genre: ["Comedy"],
        rating: 7.0,
        synopsis: "Life in Barbie Land changes.",
        duration: 114,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
        trailer: "https://www.youtube.com/embed/pBk4NYhWNMM"
    },
    {
        id: "movie_22",
        title: "The Batman",
        genre: ["Crime"],
        rating: 7.9,
        synopsis: "Batman hunts the Riddler.",
        duration: 176,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        trailer: "https://www.youtube.com/embed/mqqft2x_Aa4"
    },
    {
        id: "movie_23",
        title: "Mad Max: Fury Road",
        genre: ["Action"],
        rating: 8.1,
        synopsis: "High-octane desert chase.",
        duration: 120,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
        trailer: "https://www.youtube.com/embed/hEJnMQG9ev8"
    },
    {
        id: "movie_24",
        title: "John Wick",
        genre: ["Action"],
        rating: 7.4,
        synopsis: "Revenge of a hitman.",
        duration: 101,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        trailer: "https://www.youtube.com/embed/2AUmvWm5ZDQ"
    },
    {
        id: "movie_25",
        title: "Parasite",
        genre: ["Thriller", "Drama"],
        rating: 8.5,
        synopsis: "A poor family schemes to become employed by a wealthy family.",
        duration: 132,
        status: "now_showing",
        image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        trailer: "https://www.youtube.com/embed/5xH0HfJHyaY"
    }
];

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

                // First try to fetch from Firestore
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
                        director: "N/A",
                        description: movieData.synopsis || movieData.description,
                        trailer: getEmbedUrl(movieData.trailer)
                    };
                    setMovie(formattedMovie);
                } else {
                    // Fallback to sample movies if not found in Firestore
                    const sampleMovie = SAMPLE_MOVIES.find(m => m.id === id);
                    if (sampleMovie) {
                        const formattedSampleMovie = {
                            id: sampleMovie.id,
                            title: sampleMovie.title,
                            image: sampleMovie.image || sampleMovie.poster || FALLBACK_IMAGE,
                            rating: sampleMovie.rating,
                            genre: Array.isArray(sampleMovie.genre) ? sampleMovie.genre.join(", ") : sampleMovie.genre,
                            duration: formatDuration(sampleMovie.duration),
                            director: "N/A",
                            description: sampleMovie.synopsis || sampleMovie.description,
                            trailer: getEmbedUrl(sampleMovie.trailer)
                        };
                        setMovie(formattedSampleMovie);
                    } else {
                        setMovie(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
                // Try sample movies on error as well
                const sampleMovie = SAMPLE_MOVIES.find(m => m.id === id);
                if (sampleMovie) {
                    const formattedSampleMovie = {
                        id: sampleMovie.id,
                        title: sampleMovie.title,
                        image: sampleMovie.image || sampleMovie.poster || FALLBACK_IMAGE,
                        rating: sampleMovie.rating,
                        genre: Array.isArray(sampleMovie.genre) ? sampleMovie.genre.join(", ") : sampleMovie.genre,
                        duration: formatDuration(sampleMovie.duration),
                        director: "N/A",
                        description: sampleMovie.synopsis || sampleMovie.description,
                        trailer: getEmbedUrl(sampleMovie.trailer)
                    };
                    setMovie(formattedSampleMovie);
                } else {
                    setMovie(null);
                }
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


