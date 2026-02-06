import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllMovies } from "../services/firestore.js";
import MovieCard from "../assets/components/MovieCard.jsx";
import "./Movies.css";

// Helper function to convert YouTube URL to embed format
const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

// Fallback image for broken posters
const FALLBACK_IMAGE = "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg";

const Movies = () => {
    const [searchParams] = useSearchParams();
    const urlSearchTerm = searchParams.get("search") || "";

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

    const sampleMovies = [
        { id: "movie_1", title: "Avengers: Endgame", image: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4, genre: "Action, Sci-Fi", duration: "3h 01m", status: "now_showing" },
        { id: "movie_2", title: "Interstellar", image: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, genre: "Sci-Fi, Drama", duration: "2h 49m", status: "now_showing" },
        { id: "movie_3", title: "Inception", image: "https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", rating: 8.8, genre: "Sci-Fi, Action", duration: "2h 28m", status: "now_showing" },
        { id: "movie_4", title: "The Dark Knight", image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, genre: "Action, Crime", duration: "2h 32m", status: "now_showing" },
        { id: "movie_5", title: "Joker", image: "https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", rating: 8.5, genre: "Drama, Crime", duration: "2h 02m", status: "now_showing" },
        { id: "movie_6", title: "Avatar", image: "https://image.tmdb.org/t/p/original/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg", rating: 7.9, genre: "Fantasy, Sci-Fi", duration: "2h 42m", status: "now_showing" },
        { id: "movie_7", title: "Titanic", image: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", rating: 7.8, genre: "Drama, Romance", duration: "3h 15m", status: "now_showing" },
        { id: "movie_8", title: "Gladiator", image: "https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", rating: 8.5, genre: "Action, Drama", duration: "2h 35m", status: "now_showing" },
        { id: "movie_9", title: "The Matrix", image: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, genre: "Sci-Fi, Action", duration: "2h 16m", status: "now_showing" },
        { id: "movie_10", title: "Forrest Gump", image: "https://image.tmdb.org/t/p/original/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", rating: 8.8, genre: "Drama, Romance", duration: "2h 22m", status: "now_showing" },
        { id: "movie_11", title: "The Shawshank Redemption", image: "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", rating: 9.3, genre: "Drama", duration: "2h 22m", status: "now_showing" },
        { id: "movie_12", title: "Fight Club", image: "https://image.tmdb.org/t/p/original/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg", rating: 8.8, genre: "Drama", duration: "2h 19m", status: "now_showing" },
        { id: "movie_13", title: "Pulp Fiction", image: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, genre: "Crime, Drama", duration: "2h 34m", status: "now_showing" },
        { id: "movie_14", title: "The Godfather", image: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", rating: 9.2, genre: "Crime, Drama", duration: "2h 55m", status: "now_showing" },
        { id: "movie_15", title: "Doctor Strange", image: "https://image.tmdb.org/t/p/original/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg", rating: 7.5, genre: "Action, Sci-Fi", duration: "1h 55m", status: "now_showing" },
        { id: "movie_16", title: "Black Panther", image: "https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", rating: 7.3, genre: "Action, Adventure", duration: "2h 14m", status: "now_showing" },
        { id: "movie_17", title: "Iron Man", image: "https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", rating: 7.9, genre: "Action, Sci-Fi", duration: "2h 06m", status: "now_showing" },
        { id: "movie_18", title: "Spider-Man: No Way Home", image: "https://image.tmdb.org/t/p/original/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg", rating: 8.2, genre: "Action, Adventure", duration: "2h 28m", status: "coming_soon" },
        { id: "movie_19", title: "Dune", image: "https://image.tmdb.org/t/p/original/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", rating: 8.0, genre: "Sci-Fi, Adventure", duration: "2h 35m", status: "coming_soon" },
        { id: "movie_20", title: "Oppenheimer", image: "https://image.tmdb.org/t/p/original/ptpr0kGAckfQkJeJIt8st5dglvd.jpg", rating: 8.6, genre: "Drama, Thriller", duration: "3h 00m", status: "coming_soon" },
        { id: "movie_21", title: "Barbie", image: "https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", rating: 7.0, genre: "Comedy, Fantasy", duration: "1h 54m", status: "now_showing" },
        { id: "movie_22", title: "The Batman", image: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg", rating: 7.9, genre: "Action, Crime", duration: "2h 56m", status: "now_showing" },
        { id: "movie_23", title: "Mad Max: Fury Road", image: "https://image.tmdb.org/t/p/original/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", rating: 8.1, genre: "Action, Adventure", duration: "2h 00m", status: "now_showing" },
        { id: "movie_24", title: "John Wick", image: "https://image.tmdb.org/t/p/original/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg", rating: 7.4, genre: "Action, Thriller", duration: "1h 41m", status: "now_showing" },
        { id: "movie_25", title: "Parasite", image: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", rating: 8.5, genre: "Drama, Thriller", duration: "2h 12m", status: "now_showing" }
    ];

    useEffect(() => {
        let mounted = true;

        const loadMovies = async () => {
            try {
                setLoading(true);
                const moviesData = await getAllMovies();
                console.log("MOVIES: Got", moviesData.length, "movies from Firestore");

                if (!mounted) return;

                // Fallback to sample movies if Firestore is empty or has too few movies
                if (moviesData.length < 10) {
                    console.log("MOVIES: Firestore has fewer than 10 movies, using fallback sample movies");
                    setMovies(sampleMovies);
                } else {
                    console.log("MOVIES: Using Firestore movies");
                    const formattedMovies = moviesData.map(movie => ({
                        id: movie.id,
                        title: movie.title,
                        image: movie.image || movie.poster || FALLBACK_IMAGE,
                        rating: movie.rating,
                        genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
                        duration: movie.duration,
                        trailer: getEmbedUrl(movie.trailer),
                        status: movie.status || "now_showing" // Default status
                    }));
                    setMovies(formattedMovies);
                }
                console.log("MOVIES: Movies state updated, total:", movies.length);
            } catch (error) {
                console.error("Error loading movies:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadMovies();

        return () => {
            mounted = false;
        };
    }, []);

    const scrollRow = (direction, rowId) => {
        const row = document.getElementById(rowId);
        if (row) {
            const scrollAmount = 300;
            if (direction === 'left') {
                row.scrollLeft -= scrollAmount;
            } else {
                row.scrollLeft += scrollAmount;
            }
        }
    };

    const getMoviesByStatus = (status) => {
        return movies.filter(movie => movie.status === status);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMovies = movies.filter(movie =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nowShowingMovies = getMoviesByStatus("now_showing");
    const comingSoonMovies = getMoviesByStatus("coming_soon");

    if (loading) {
        return (
            <div className="streamx-movies-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="streamx-loader"></div>
            </div>
        );
    }

    return (
        <div className="streamx-movies-page">
            <div className="movies-header">
                <h1 className="movies-page-title">Browse Movies</h1>
                <div className="search-container">
                    <svg viewBox="0 0 24 24" className="search-icon">
                        <path fill="#808080" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            </div>

            {searchTerm && (
                <section className="movie-row">
                    <h2 className="row-title">Search Results</h2>
                    <div className="row-content" id="search-results">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} size="medium" showStatus={true} />
                            ))
                        ) : (
                            <p className="no-results">No movies found matching "{searchTerm}"</p>
                        )}
                    </div>
                </section>
            )}

            <div className="movies-tabs">
                <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Movies
                </button>
                <button
                    className={`tab-btn ${activeTab === 'now_showing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('now_showing')}
                >
                    Now Showing
                </button>
                <button
                    className={`tab-btn ${activeTab === 'coming_soon' ? 'active' : ''}`}
                    onClick={() => setActiveTab('coming_soon')}
                >
                    Coming Soon
                </button>
            </div>

            {(activeTab === 'all' && !searchTerm) && movies.length > 0 && (
                <section className="movie-row">
                    <h2 className="row-title">All Movies</h2>
                    <div className="movies-all-grid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} size="medium" showStatus={true} />
                        ))}
                    </div>
                </section>
            )}

            {(activeTab === 'now_showing' && !searchTerm) && nowShowingMovies.length > 0 && (
                <section className="movie-row">
                    <h2 className="row-title">Now Showing</h2>
                    <div className="row-content" id="now-showing">
                        {nowShowingMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} size="medium" showStatus={true} />
                        ))}
                    </div>
                    <button
                        className="scroll-btn scroll-left"
                        onClick={() => scrollRow('left', 'now-showing')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <button
                        className="scroll-btn scroll-right"
                        onClick={() => scrollRow('right', 'now-showing')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </section>
            )}

            {(activeTab === 'coming_soon' && !searchTerm) && comingSoonMovies.length > 0 && (
                <section className="movie-row">
                    <h2 className="row-title">Coming Soon</h2>
                    <div className="row-content" id="coming-soon">
                        {comingSoonMovies.slice(0, 3).map((movie) => (
                            <MovieCard key={movie.id} movie={movie} size="medium" showStatus={true} />
                        ))}
                    </div>
                    <button
                        className="scroll-btn scroll-left"
                        onClick={() => scrollRow('left', 'coming-soon')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <button
                        className="scroll-btn scroll-right"
                        onClick={() => scrollRow('right', 'coming-soon')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </section>
            )}

            <footer className="streamx-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo">CINE BOOK</span>
                    </div>
                    <div className="footer-copyright">© 2024 CINE BOOK - Movie Booking App</div>
                </div>
            </footer>
        </div>
    );
};

export default Movies;
