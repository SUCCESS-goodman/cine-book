import { Link } from "react-router-dom";
import "./MovieCard.css";

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
);

const ExpandIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
);

const MovieCard = ({ movie, size = "medium", showStatus = false }) => {
    const posterUrl = movie.poster || movie.image;
    const title = movie.title || movie.title;
    const rating = movie.rating || movie.rating;
    const duration = movie.duration || movie.duration;
    const genre = movie.genre || (Array.isArray(movie.genre) ? movie.genre[0] : "Drama");
    const status = movie.status || "now_showing";

    return (
        <Link to={`/movies/${movie.id}`} className="movie-card-link">
            <div className={`movie-card movie-card-${size} glass-card glass-card-hover`}>
                <div className="movie-card-image-container">
                    <img
                        src={posterUrl}
                        alt={title}
                        className="movie-card-image"
                        loading="lazy"
                    />

                    {/* Rating Badge */}
                    {rating && (
                        <div className="rating-badge">
                            ⭐ {rating.toFixed(1)}
                        </div>
                    )}

                    {/* Status Badge */}
                    {showStatus && (
                        <div className={`status-badge ${status === "now_showing" ? "now-showing" : "coming-soon"}`}>
                            {status === "now_showing" ? "Now Playing" : "Coming Soon"}
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="movie-card-overlay">
                        <div className="movie-card-buttons">
                            <button className="overlay-btn play-btn" aria-label="Play">
                                <PlayIcon />
                            </button>
                            <button className="overlay-btn add-btn" aria-label="Add to list">
                                <PlusIcon />
                            </button>
                            <button className="overlay-btn expand-btn" aria-label="More info">
                                <ExpandIcon />
                            </button>
                        </div>

                        <div className="movie-card-info">
                            <h3 className="movie-card-title">{title}</h3>
                            <div className="movie-card-meta">
                                {rating && (
                                    <span className="movie-rating">
                                        <StarIcon />
                                        {rating.toFixed(1)}
                                    </span>
                                )}
                                <span className="movie-genre">{genre}</span>
                                {duration && (
                                    <span className="movie-duration">
                                        <ClockIcon />
                                        {duration}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
