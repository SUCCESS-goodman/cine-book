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
        let mounted = true;

        const loadMovies = async () => {
            try {
                setLoading(true);
                const moviesData = await getAllMovies();
                console.log("HOME: Got", moviesData.length, "movies from Firestore");

                if (!mounted) return;

                // Fallback to sample movies if Firestore is empty or has too few movies
                if (moviesData.length < 10) {
                    console.log("HOME: Firestore has fewer than 10 movies, using fallback sample movies");
                    const sampleMovies = [
                        { id: "movie_1", title: "Avengers: Endgame", image: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4, genre: "Action, Sci-Fi", duration: "3h 01m", description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.", status: "now_showing" },
                        { id: "movie_2", title: "Interstellar", image: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, genre: "Sci-Fi, Drama", duration: "2h 49m", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", status: "now_showing" },
                        { id: "movie_3", title: "Inception", image: "https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", rating: 8.8, genre: "Sci-Fi, Action", duration: "2h 28m", description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.", status: "now_showing" },
                        { id: "movie_4", title: "The Dark Knight", image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, genre: "Action, Crime", duration: "2h 32m", description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.", status: "now_showing" },
                        { id: "movie_5", title: "Joker", image: "https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", rating: 8.5, genre: "Drama, Crime", duration: "2h 02m", description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.", status: "now_showing" },
                        { id: "movie_6", title: "Avatar", image: "https://image.tmdb.org/t/p/original/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg", rating: 7.9, genre: "Fantasy, Sci-Fi", duration: "2h 42m", description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.", status: "now_showing" },
                        { id: "movie_7", title: "Titanic", image: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", rating: 7.8, genre: "Drama, Romance", duration: "3h 15m", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious Titanic.", status: "now_showing" },
                        { id: "movie_8", title: "Gladiator", image: "https://image.tmdb.org/t/p/original/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", rating: 8.5, genre: "Action, Drama", duration: "2h 35m", description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", status: "now_showing" },
                        { id: "movie_9", title: "The Matrix", image: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, genre: "Sci-Fi, Action", duration: "2h 16m", description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", status: "now_showing" },
                        { id: "movie_10", title: "Forrest Gump", image: "https://image.tmdb.org/t/p/original/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", rating: 8.8, genre: "Drama, Romance", duration: "2h 22m", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.", status: "now_showing" },
                        { id: "movie_11", title: "The Shawshank Redemption", image: "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", rating: 9.3, genre: "Drama", duration: "2h 22m", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", status: "now_showing" },
                        { id: "movie_12", title: "Fight Club", image: "https://image.tmdb.org/t/p/original/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg", rating: 8.8, genre: "Drama", duration: "2h 19m", description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.", status: "now_showing" },
                        { id: "movie_13", title: "Pulp Fiction", image: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, genre: "Crime, Drama", duration: "2h 34m", description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", status: "now_showing" },
                        { id: "movie_14", title: "The Godfather", image: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", rating: 9.2, genre: "Crime, Drama", duration: "2h 55m", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", status: "now_showing" },
                        { id: "movie_15", title: "Doctor Strange", image: "https://image.tmdb.org/t/p/original/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg", rating: 7.5, genre: "Action, Sci-Fi", duration: "1h 55m", description: "A surgeon makes a discovery that leads him into a world of sorcery.", status: "now_showing" },
                        { id: "movie_16", title: "Black Panther", image: "https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", rating: 7.3, genre: "Action, Adventure", duration: "2h 14m", description: "T'Challa, the King of Wakanda, rises to the throne but is challenged by a rival.", status: "now_showing" },
                        { id: "movie_17", title: "Iron Man", image: "https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", rating: 7.9, genre: "Action, Sci-Fi", duration: "2h 06m", description: "After being held captive, billionaire Tony Stark builds a high-tech suit and becomes Iron Man.", status: "now_showing" },
                        { id: "movie_18", title: "Spider-Man: No Way Home", image: "https://image.tmdb.org/t/p/original/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg", rating: 8.2, genre: "Action, Adventure", duration: "2h 28m", description: "Spider-Man's identity is revealed, bringing his responsibilities into conflict with his personal life.", status: "coming_soon" },
                        { id: "movie_19", title: "Dune", image: "https://image.tmdb.org/t/p/original/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", rating: 8.0, genre: "Sci-Fi, Adventure", duration: "2h 35m", description: "Paul Atreides must travel to the most dangerous planet in the universe to ensure the future of his family.", status: "coming_soon" },
                        { id: "movie_20", title: "Oppenheimer", image: "https://image.tmdb.org/t/p/original/ptpr0kGAckfQkJeJIt8st5dglvd.jpg", rating: 8.6, genre: "Drama, Thriller", duration: "3h 00m", description: "The story of American scientist J. Robert Oppenheimer and his role in developing the atomic bomb.", status: "coming_soon" },
                        { id: "movie_21", title: "Barbie", image: "https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", rating: 7.0, genre: "Comedy, Fantasy", duration: "1h 54m", description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.", status: "now_showing" },
                        { id: "movie_22", title: "The Batman", image: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg", rating: 7.9, genre: "Action, Crime", duration: "2h 56m", description: "When a serial killer begins murdering politicians in Gotham, Batman is forced to investigate.", status: "now_showing" },
                        { id: "movie_23", title: "Mad Max: Fury Road", image: "https://image.tmdb.org/t/p/original/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", rating: 8.1, genre: "Action, Adventure", duration: "2h 00m", description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.", status: "now_showing" },
                        { id: "movie_24", title: "John Wick", image: "https://image.tmdb.org/t/p/original/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg", rating: 7.4, genre: "Action, Thriller", duration: "1h 41m", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog.", status: "now_showing" },
                        { id: "movie_25", title: "Parasite", image: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", rating: 8.5, genre: "Drama, Thriller", duration: "2h 12m", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", status: "now_showing" }
                    ];
                    setMovies(sampleMovies);
                    console.log("HOME: Set fallback movies, count:", sampleMovies.length);
                    setFeaturedMovie(sampleMovies[0]);
                } else {
                    setMovies(moviesData);
                    console.log("HOME: Set Firestore movies, count:", moviesData.length);
                    if (moviesData.length > 0) {
                        setFeaturedMovie(moviesData[Math.floor(Math.random() * moviesData.length)]);
                    }
                }
                console.log("HOME: Movies state updated, total:", movies.length);
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

    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    // Separate movies by status
    const nowShowingMovies = movies.filter(m => m.status === "now_showing");
    const comingSoonMovies = movies.filter(m => m.status === "coming_soon");
    // Get all movies for trending section (no limit)
    const trendingMovies = [...nowShowingMovies]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    console.log("HOME: Rendering - movies:", movies.length, "nowShowing:", nowShowingMovies.length, "trending:", trendingMovies.length);

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
                                    {featuredMovie.rating || "N/A"}
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

            {/* Trending Section - All Now Showing Movies */}
            <section className="all-movies-section">
                <h2 className="section-title">All Movies ({trendingMovies.length})</h2>
                <div className="movies-grid">
                    {trendingMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} size="medium" showStatus />
                    ))}
                </div>
            </section>

            <div className="view-all-section">
                <Link to="/movies" className="view-all-link">
                    View All Movies →
                </Link>
            </div>

            {/* Coming Soon Section - Show only 3 movies */}
            {comingSoonMovies.length > 0 && (
                <section className="all-movies-section coming-soon-section">
                    <h2 className="section-title">Coming Soon ({comingSoonMovies.length})</h2>
                    <div className="movies-grid">
                        {comingSoonMovies.slice(0, 3).map((movie) => (
                            <MovieCard key={movie.id} movie={movie} size="medium" showStatus />
                        ))}
                    </div>
                    <div className="view-all-section">
                        <Link to="/movies" className="view-all-link">
                            View More Coming Soon →
                        </Link>
                    </div>
                </section>
            )}

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
                    <div className="footer-copyright">© 2024 CINE BOOK - Movie Booking App</div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
