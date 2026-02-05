import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../assets/components/MovieCard";
import { getAllMovies } from "../services/firestore";
import "./Home.css";

// Fallback image for broken posters
const FALLBACK_IMAGE = "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const moviesData = await getAllMovies();

                // Fallback to sample movies if Firestore is empty
                if (moviesData.length === 0) {
                    const sampleMovies = [
                        {
                            id: "movie_1",
                            title: "Avengers: Endgame",
                            image: "https://image.tmdb.org/t/p/original/ck2QbdYsXoEd6m3bB29cLLfQq8.jpg",
                            rating: 8.4,
                            genre: "Action, Sci-Fi",
                            duration: "3h 01m",
                            description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_2",
                            title: "Interstellar",
                            image: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                            rating: 8.6,
                            genre: "Sci-Fi, Drama",
                            duration: "2h 49m",
                            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_3",
                            title: "Inception",
                            image: "https://image.tmdb.org/t/p/original/9gk7admal43BSEYvL8XXMH2r9rP.jpg",
                            rating: 8.8,
                            genre: "Sci-Fi, Action",
                            duration: "2h 28m",
                            description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_4",
                            title: "The Dark Knight",
                            image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                            rating: 9.0,
                            genre: "Action, Crime",
                            duration: "2h 32m",
                            description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_5",
                            title: "Joker",
                            image: "https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                            rating: 8.5,
                            genre: "Drama, Crime",
                            duration: "2h 02m",
                            description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_6",
                            title: "Titanic",
                            image: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                            rating: 7.9,
                            genre: "Romance, Drama",
                            duration: "3h 15m",
                            description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious Titanic.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_7",
                            title: "The Matrix",
                            image: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                            rating: 8.7,
                            genre: "Sci-Fi, Action",
                            duration: "2h 16m",
                            description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_8",
                            title: "Pulp Fiction",
                            image: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                            rating: 8.9,
                            genre: "Crime, Drama",
                            duration: "2h 34m",
                            description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_9",
                            title: "Forrest Gump",
                            image: "https://image.tmdb.org/t/p/original/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                            rating: 8.8,
                            genre: "Drama, Romance",
                            duration: "2h 22m",
                            description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_10",
                            title: "Gladiator",
                            image: "https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
                            rating: 8.5,
                            genre: "Action, Drama",
                            duration: "2h 35m",
                            description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_11",
                            title: "The Shawshank Redemption",
                            image: "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                            rating: 9.3,
                            genre: "Drama",
                            duration: "2h 22m",
                            description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                            status: "now_showing"
                        },
                        {
                            id: "movie_12",
                            title: "Fight Club",
                            image: "https://image.tmdb.org/t/p/original/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
                            rating: 8.8,
                            genre: "Drama",
                            duration: "2h 19m",
                            description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
                            status: "now_showing"
                        }
                    ];
                    setMovies(sampleMovies);
                    setFeaturedMovie(sampleMovies[0]);
                } else {
                    setMovies(moviesData);
                    if (moviesData.length > 0) {
                        setFeaturedMovie(moviesData[Math.floor(Math.random() * moviesData.length)]);
                    }
                }
            } catch (error) {
                console.error("Error loading movies:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

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

    const getMoviesByGenre = (genre) => {
        return movies.filter(movie => {
            const movieGenre = movie.genre;
            if (Array.isArray(movieGenre)) {
                return movieGenre.some(g => g.toLowerCase().includes(genre.toLowerCase()));
            }
            return movieGenre?.toLowerCase().includes(genre.toLowerCase());
        });
    };

    const trendingMovies = movies.slice(0, 12);
    const actionMovies = getMoviesByGenre("action");
    const scifiMovies = getMoviesByGenre("sci-fi");
    const dramaMovies = getMoviesByGenre("drama");

    if (loading) {
        return (
            <div className="streamx-loading">
                <div className="streamx-loader"></div>
            </div>
        );
    }

    return (
        <div className="streamx-home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    {featuredMovie && (
                        <>
                            <img
                                src={featuredMovie.image}
                                alt={featuredMovie.title}
                                onError={handleImageError}
                                className="hero-image"
                            />
                            <div className="hero-gradient-1"></div>
                            <div className="hero-gradient-2"></div>
                        </>
                    )}
                </div>
                <div className="hero-content">
                    {featuredMovie && (
                        <>
                            <div className="hero-badge">🎬 Now Playing</div>
                            <h1 className="hero-title">{featuredMovie.title}</h1>
                            <p className="hero-description">{featuredMovie.description}</p>
                            <div className="hero-meta">
                                <span className="hero-rating">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    {featuredMovie.rating}
                                </span>
                                <span className="hero-genre">{featuredMovie.genre}</span>
                                <span className="hero-duration">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                                    {featuredMovie.duration}
                                </span>
                            </div>
                            <div className="hero-buttons">
                                <Link to={`/movies/${featuredMovie.id}`} className="hero-btn play-btn">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Book Now
                                </Link>
                                <Link to={`/movies/${featuredMovie.id}`} className="hero-btn info-btn">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                                        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                    </svg>
                                    More Info
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className="hero-fade-bottom"></div>
            </section>

            {/* Movie Rows */}
            <div className="movie-rows-container">
                {/* Trending Now */}
                <section className="movie-row">
                    <div className="row-header">
                        <h2 className="row-title">Trending Now</h2>
                    </div>
                    <div className="row-content" id="trending-row">
                        {trendingMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} size="medium" showStatus />
                        ))}
                    </div>
                    <button
                        className="scroll-btn scroll-left"
                        onClick={() => scrollRow('left', 'trending-row')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <button
                        className="scroll-btn scroll-right"
                        onClick={() => scrollRow('right', 'trending-row')}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </section>

                {/* Action Movies */}  


                {actionMovies.length > 0 && (
                    <section className="movie-row">
                        <h2 className="row-title">Action & Adventure</h2>
                        <div className="row-content" id="action-row">
                            {actionMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} size="medium" />
                            ))}
                        </div>
                        <button
                            className="scroll-btn scroll-left"
                            onClick={() => scrollRow('left', 'action-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button
                            className="scroll-btn scroll-right"
                            onClick={() => scrollRow('right', 'action-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>
                    </section>
                )}

                {/* Sci-Fi Movies */}

                
                {scifiMovies.length > 0 && (
                    <section className="movie-row">
                        <h2 className="row-title">Sci-Fi & Fantasy</h2>
                        <div className="row-content" id="scifi-row">
                            {scifiMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} size="medium" />
                            ))}
                        </div>
                        <button
                            className="scroll-btn scroll-left"
                            onClick={() => scrollRow('left', 'scifi-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button
                            className="scroll-btn scroll-right"
                            onClick={() => scrollRow('right', 'scifi-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>
                    </section>
                )}

                {/* Drama Movies */}
                {dramaMovies.length > 0 && (
                    <section className="movie-row">
                        <h2 className="row-title">Drama</h2>
                        <div className="row-content" id="drama-row">
                            {dramaMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} size="medium" />
                            ))}
                        </div>
                        <button
                            className="scroll-btn scroll-left"
                            onClick={() => scrollRow('left', 'drama-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button
                            className="scroll-btn scroll-right"
                            onClick={() => scrollRow('right', 'drama-row')}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>
                    </section>
                )}
            </div>

            {/* Footer */}
            <footer className="streamx-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo">CINE BOOK</span>
                    </div>
                    <div className="footer-links">
                        <a href="#">Audio and Subtitles</a>
                        <a href="#">Media Center</a>
                        <a href="#">Privacy</a>
                        <a href="#">Contact Us</a>
                    </div>
                    <div className="footer-links">
                        <a href="#">Audio Description</a>
                        <a href="#">Investor Relations</a>
                        <a href="#">Legal Notices</a>
                    </div>
                    <div className="footer-links">
                        <a href="#">Help Center</a>
                        <a href="#">Jobs</a>
                        <a href="#">Cookie Preferences</a>
                    </div>
                    <div className="footer-links">
                        <a href="#">Gift Cards</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Corporate Information</a>
                    </div>
                    <div className="footer-social">
                        <a href="#" className="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" className="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="#" className="social-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>
                    </div>
                    <p className="footer-copyright">© 2024 CINE BOOK - Movie Booking App</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
