import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Footer from "./Footer.jsx";

/* ========== DATA & HELPERS (all in one file) ========== */
const STORAGE_KEY = "movie_bookings";
const TMDB_API = "https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const SCREENS = ["Screen 1", "Screen 2", "Screen 3"];
const TIMES = ["10:00", "14:30", "19:00", "11:00", "20:00"];
const DATES = ["2025-02-05", "2025-02-06", "2025-02-07"];

function generateShowtimes(movieId, index) {
  const count = 4 + (index % 3);
  return Array.from({ length: count }, (_, i) => ({
    id: `st-${movieId}-${i}`,
    date: DATES[i % DATES.length],
    time: TIMES[i % TIMES.length],
    screen: SCREENS[i % SCREENS.length],
    price: 10 + (i % 3) * 2,
  }));
}

function mapTmdbToMovie(tmdb, index) {
  return {
    id: String(tmdb.id),
    title: tmdb.title || tmdb.original_title || "Untitled",
    genre: "Movie",
    duration: "2h 00m",
    rating: tmdb.vote_average ? tmdb.vote_average.toFixed(1) : "—",
    description: tmdb.overview || "No description available.",
    poster: tmdb.poster_path ? `${TMDB_IMG}${tmdb.poster_path}` : null,
    showtimes: generateShowtimes(tmdb.id, index),
  };
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const SEATS_PER_ROW = 12;
const AISLE_AFTER = 5;

function generateSeatId(rowIndex, colIndex) {
  return `${ROWS[rowIndex]}${colIndex + 1}`;
}

function getBookingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookingToStorage(booking) {
  const list = getBookingsFromStorage();
  list.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatDate(str) {
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

/* ========== STYLES (scoped in JSX) ========== */
const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    color: "#e8e8e8",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 20px 40px", flex: 1 },
  nav: {
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navBrand: { fontSize: 22, fontWeight: 700, letterSpacing: 1 },
  navLinks: { display: "flex", gap: 20 },
  navBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px",
  },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 12, background: "linear-gradient(90deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 18, opacity: 0.85 },
  sectionTitle: { fontSize: 24, marginBottom: 24, fontWeight: 600 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 },
  movieCard: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  movieCardPoster: {
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 64,
    background: "rgba(0,0,0,0.3)",
  },
  movieCardBody: { padding: 16 },
  movieCardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 6 },
  movieCardMeta: { fontSize: 13, opacity: 0.8 },
  detailLayout: { display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" },
  detailPoster: {
    width: 280,
    height: 380,
    borderRadius: 16,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 120,
    flexShrink: 0,
  },
  detailInfo: { flex: "1 1 300px" },
  detailTitle: { fontSize: 32, fontWeight: 800, marginBottom: 8 },
  detailMeta: { fontSize: 15, opacity: 0.9, marginBottom: 16 },
  detailDesc: { fontSize: 16, lineHeight: 1.6, opacity: 0.9, marginBottom: 24 },
  showtimeGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
  showtimeBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    minWidth: 140,
  },
  screenLabel: {
    textAlign: "center",
    margin: "24px 0 16px",
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  seatMap: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: 24,
    background: "rgba(0,0,0,0.25)",
    borderRadius: 16,
  },
  seatRow: { display: "flex", gap: 4, alignItems: "center" },
  rowLabel: { width: 24, textAlign: "center", fontSize: 12, fontWeight: 600 },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "2px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  seatAvailable: { background: "rgba(74,222,128,0.3)", borderColor: "rgba(74,222,128,0.6)" },
  seatSelected: { background: "#8b5cf6", borderColor: "#a78bfa" },
  seatSold: { background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.15)", cursor: "not-allowed", opacity: 0.6 },
  formGroup: { marginBottom: 16 },
  formLabel: { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 },
  formInput: {
    width: "100%",
    maxWidth: 360,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 15,
    boxSizing: "border-box",
  },
  btnPrimary: {
    background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 20px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    marginRight: 10,
  },
  summaryBox: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    maxWidth: 400,
  },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 },
  confirmationCard: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 32,
    maxWidth: 480,
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid rgba(167,139,250,0.3)",
  },
  confirmationIcon: { fontSize: 56, marginBottom: 16 },
  bookingList: { display: "flex", flexDirection: "column", gap: 16 },
  bookingCard: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  bookingId: { fontSize: 12, opacity: 0.7, marginBottom: 8 },
  legend: { display: "flex", gap: 20, justifyContent: "center", marginTop: 16, fontSize: 13, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },
  legendBox: { width: 20, height: 20, borderRadius: 4 },
};

/* ========== MAIN APP COMPONENT ========== */
export default function MovieBookingApp() {
  const [view, setView] = useState("home");
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [soldSeats, setSoldSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState(getBookingsFromStorage);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [lastBooking, setLastBooking] = useState(null);
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (view === "mybookings") setBookings(getBookingsFromStorage());
  }, [view]);

  useEffect(() => {
    let cancelled = false;
    setMoviesLoading(true);
    setMoviesError(null);
    fetch(TMDB_API)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list = (data.results || []).slice(0, 20).map(mapTmdbToMovie);
        setMovies(list);
      })
      .catch((err) => {
        if (!cancelled) setMoviesError(err.message || "Failed to load movies");
      })
      .finally(() => {
        if (!cancelled) setMoviesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  function goHome() {
    setView("home");
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setLastBooking(null);
  }

  function openMovies() {
    setView("movies");
    setSelectedMovie(null);
  }

  function openDetail(movie) {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setView("detail");
    const sold = {};
    bookings.forEach((b) => {
      const key = `${b.movieId}-${b.showtimeId}`;
      if (!sold[key]) sold[key] = [];
      sold[key].push(...(b.seats || []));
    });
    setSoldSeats(sold);
  }

  function selectShowtime(movie, st) {
    setSelectedShowtime(st);
    setSelectedSeats([]);
    const key = `${movie.id}-${st.id}`;
    const sold = {};
    bookings.forEach((b) => {
      const k = `${b.movieId}-${b.showtimeId}`;
      if (!sold[k]) sold[k] = [];
      sold[k].push(...(b.seats || []));
    });
    setSoldSeats(sold);
  }

  function toggleSeat(seatId) {
    const sold = soldSeats[`${selectedMovie?.id}-${selectedShowtime?.id}`] || [];
    if (sold.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  }

  function startBooking() {
    if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) return;
    setView("booking");
  }

  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submitBooking(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const id = "BK-" + Date.now();
    const booking = {
      id,
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      showtimeId: selectedShowtime.id,
      date: selectedShowtime.date,
      time: selectedShowtime.time,
      screen: selectedShowtime.screen,
      pricePerSeat: selectedShowtime.price,
      seats: [...selectedSeats],
      total: selectedShowtime.price * selectedSeats.length,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: "Confirmed",
    };
    saveBookingToStorage(booking);
    setBookings(getBookingsFromStorage());
    setLastBooking(booking);
    setForm({ name: "", email: "", phone: "" });
    setSelectedSeats([]);
    setView("confirmation");
  }

  const totalPrice = selectedShowtime ? selectedShowtime.price * selectedSeats.length : 0;
  const soldForCurrent = selectedMovie && selectedShowtime
    ? (soldSeats[`${selectedMovie.id}-${selectedShowtime.id}`] || [])
    : [];

  return (
    <div style={styles.app}>
      <style>{`
        .movie-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); }
        .showtime-btn:hover, .nav-btn:hover { background: rgba(255,255,255,0.15); }
        .seat-available:hover { background: rgba(74,222,128,0.5); }
        .btn-primary:hover { filter: brightness(1.1); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        @media (max-width: 768px) {
          .movie-booking-nav { flex-wrap: wrap; gap: 12px; padding: 12px 16px; }
          .movie-booking-nav-links { flex-wrap: wrap; }
          .movie-booking-seat-map-wrap { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
          .movie-booking-seat-map { min-width: min-content; }
          .movie-booking-hero-title { font-size: 28px !important; }
          .movie-booking-detail-title { font-size: 24px !important; }
          .movie-booking-detail-poster { width: 100%; max-width: 280px; height: 320px; }
        }
        @media (max-width: 480px) {
          .movie-booking-container { padding-left: 12px; padding-right: 12px; }
          .movie-booking-showtime-btn { min-width: 100%; }
        }
      `}</style>

      <nav style={styles.nav} className="movie-booking-nav">
        <span style={styles.navBrand}>CINE BOOK</span>
        <div style={styles.navLinks} className="movie-booking-nav-links">
          <button type="button" style={styles.navBtn} className="nav-btn" onClick={goHome}>Home</button>
          <button type="button" style={styles.navBtn} className="nav-btn" onClick={openMovies}>Movies</button>
          <button type="button" style={styles.navBtn} className="nav-btn" onClick={() => setView("mybookings")}>My Bookings</button>
          {authLoading ? (
            <span style={{ opacity: 0.7 }}>Loading…</span>
          ) : user ? (
            <>
              <span style={{ fontSize: 14, opacity: 0.9 }} title={user.email}>{user.email?.split("@")[0]}</span>
              <button type="button" style={styles.navBtn} className="nav-btn" onClick={() => logout().then(goHome)}>Logout</button>
            </>
          ) : (
            <>
              <button type="button" style={styles.navBtn} className="nav-btn" onClick={() => setView("login")}>Login</button>
              <button type="button" style={styles.navBtn} className="nav-btn" onClick={() => setView("register")}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      <div style={styles.container} className="movie-booking-container">
        {view === "login" && (
          <Login
            onSwitchToRegister={() => setView("register")}
            onSuccess={() => setView("home")}
          />
        )}
        {view === "register" && (
          <Register
            onSwitchToLogin={() => setView("login")}
            onSuccess={() => setView("home")}
          />
        )}
        {view === "home" && (
          <>
            <div style={styles.hero}>
              <h1 style={styles.heroTitle}>Book Your Movie</h1>
              <p style={styles.heroSub}>Choose a film, pick a showtime, and secure your seats.</p>
              <button type="button" style={{ ...styles.btnPrimary, marginTop: 24 }} onClick={openMovies}>
                Browse Movies
              </button>
            </div>
          </>
        )}

        {view === "movies" && (
          <div style={{ padding: "40px 0" }}>
            <h2 style={styles.sectionTitle}>Now Showing</h2>
            {moviesLoading && <p style={{ opacity: 0.9 }}>Loading movies…</p>}
            {moviesError && <p style={{ color: "#f87171" }}>Error: {moviesError}</p>}
            {!moviesLoading && !moviesError && (
              <div style={styles.cardGrid}>
                {movies.map((m) => (
                  <div
                    key={m.id}
                    style={styles.movieCard}
                    className="movie-card"
                    onClick={() => openDetail(m)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openDetail(m)}
                  >
                    <div style={styles.movieCardPoster}>
                      {m.poster ? (
                        <img src={m.poster} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 48 }}>🎬</span>
                      )}
                    </div>
                    <div style={styles.movieCardBody}>
                      <div style={styles.movieCardTitle}>{m.title}</div>
                      <div style={styles.movieCardMeta}>{m.genre} · {m.duration} · ★ {m.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "detail" && selectedMovie && (
          <div style={{ padding: "40px 0" }}>
            <button type="button" style={styles.btnSecondary} onClick={() => setView("movies")}>← Back</button>
            <div style={{ ...styles.detailLayout, marginTop: 24 }}>
              <div style={styles.detailPoster} className="movie-booking-detail-poster">
                {selectedMovie.poster ? (
                  <img src={selectedMovie.poster} alt={selectedMovie.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
                ) : (
                  <span style={{ fontSize: 100 }}>🎬</span>
                )}
              </div>
              <div style={styles.detailInfo}>
                <h1 style={styles.detailTitle} className="movie-booking-detail-title">{selectedMovie.title}</h1>
                <div style={styles.detailMeta}>{selectedMovie.genre} · {selectedMovie.duration} · ★ {selectedMovie.rating}</div>
                <p style={styles.detailDesc}>{selectedMovie.description}</p>
                <h3 style={styles.sectionTitle}>Showtimes</h3>
                <div style={styles.showtimeGrid}>
                  {selectedMovie.showtimes.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className="showtime-btn movie-booking-showtime-btn"
                      style={{
                        ...styles.showtimeBtn,
                        ...(selectedShowtime?.id === st.id ? { background: "rgba(139,92,246,0.4)", borderColor: "#a78bfa" } : {}),
                      }}
                      onClick={() => selectShowtime(selectedMovie, st)}
                    >
                      {formatDate(st.date)} · {st.time}<br />
                      <small>{st.screen} · ${st.price}</small>
                    </button>
                  ))}
                </div>
                {selectedShowtime && (
                  <>
                    <div style={styles.screenLabel}>—— SCREEN ——</div>
                    <div className="movie-booking-seat-map-wrap" style={{ overflow: "auto" }}>
                      <div style={styles.seatMap} className="movie-booking-seat-map">
                        {ROWS.map((row, ri) => (
                          <div key={row} style={styles.seatRow}>
                            <span style={styles.rowLabel}>{row}</span>
                            {Array.from({ length: SEATS_PER_ROW }, (_, ci) => {
                              const seatId = generateSeatId(ri, ci);
                              const isSold = soldForCurrent.includes(seatId);
                              const isSelected = selectedSeats.includes(seatId);
                              const isAisle = ci === AISLE_AFTER - 1;
                              return (
                                <span
                                  key={seatId}
                                  style={{
                                    ...styles.seat,
                                    ...(isSold ? styles.seatSold : isSelected ? styles.seatSelected : { ...styles.seatAvailable, marginRight: isAisle ? 12 : 0 }),
                                  }}
                                  className={isSold ? "" : "seat-available"}
                                  onClick={() => toggleSeat(seatId)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === "Enter" && toggleSeat(seatId)}
                                  aria-label={`Seat ${seatId} ${isSold ? "sold" : isSelected ? "selected" : "available"}`}
                                >
                                  {isAisle ? "" : ci + 1}
                                </span>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={styles.legend}>
                      <span style={styles.legendItem}><span style={{ ...styles.legendBox, ...styles.seatAvailable }} /> Available</span>
                      <span style={styles.legendItem}><span style={{ ...styles.legendBox, ...styles.seatSelected }} /> Selected</span>
                      <span style={styles.legendItem}><span style={{ ...styles.legendBox, ...styles.seatSold }} /> Sold</span>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <div style={styles.summaryBox}>
                        <div style={styles.summaryRow}><span>Seats</span><span>{selectedSeats.length ? selectedSeats.sort().join(", ") : "—"}</span></div>
                        <div style={styles.summaryRow}><span>Price</span><span>${totalPrice.toFixed(2)}</span></div>
                      </div>
                      <button
                        type="button"
                        style={styles.btnPrimary}
                        className="btn-primary"
                        onClick={startBooking}
                        disabled={selectedSeats.length === 0}
                      >
                        Continue to Booking
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "booking" && selectedMovie && selectedShowtime && (
          <div style={{ padding: "40px 0", maxWidth: 480 }}>
            <button type="button" style={styles.btnSecondary} onClick={() => setView("detail")}>← Back</button>
            <h2 style={{ ...styles.sectionTitle, marginTop: 24 }}>Complete your booking</h2>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}><span>Movie</span><span>{selectedMovie.title}</span></div>
              <div style={styles.summaryRow}><span>Date & Time</span><span>{formatDate(selectedShowtime.date)} · {selectedShowtime.time}</span></div>
              <div style={styles.summaryRow}><span>Screen</span><span>{selectedShowtime.screen}</span></div>
              <div style={styles.summaryRow}><span>Seats</span><span>{selectedSeats.sort().join(", ")}</span></div>
              <div style={styles.summaryRow}><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
            <form onSubmit={submitBooking}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="name">Full Name *</label>
                <input id="name" name="name" style={styles.formInput} placeholder="John Doe" value={form.name} onChange={handleFormChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" style={styles.formInput} placeholder="john@example.com" value={form.email} onChange={handleFormChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" style={styles.formInput} placeholder="+1 234 567 8900" value={form.phone} onChange={handleFormChange} />
              </div>
              <button type="submit" style={styles.btnPrimary} className="btn-primary">Confirm & Pay</button>
            </form>
          </div>
        )}

        {view === "confirmation" && lastBooking && (
          <div style={{ padding: "60px 0" }}>
            <div style={styles.confirmationCard}>
              <div style={styles.confirmationIcon}>✅</div>
              <h2 style={{ marginBottom: 8 }}>Booking Confirmed</h2>
              <p style={{ opacity: 0.9, marginBottom: 24 }}>Your booking ID: <strong>{lastBooking.id}</strong></p>
              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}><span>Movie</span><span>{lastBooking.movieTitle}</span></div>
                <div style={styles.summaryRow}><span>Date & Time</span><span>{formatDate(lastBooking.date)} · {lastBooking.time}</span></div>
                <div style={styles.summaryRow}><span>Seats</span><span>{lastBooking.seats.join(", ")}</span></div>
                <div style={styles.summaryRow}><span>Total</span><span>${lastBooking.total.toFixed(2)}</span></div>
              </div>
              <p style={{ fontSize: 13, opacity: 0.8 }}>A confirmation has been sent to {lastBooking.email}</p>
              <button type="button" style={{ ...styles.btnPrimary, marginTop: 24 }} onClick={goHome}>Back to Home</button>
              <button type="button" style={{ ...styles.btnSecondary, marginTop: 12 }} onClick={() => setView("mybookings")}>View My Bookings</button>
            </div>
          </div>
        )}

        {view === "mybookings" && (
          <div style={{ padding: "40px 0" }}>
            <button type="button" style={styles.btnSecondary} onClick={goHome}>← Home</button>
            <h2 style={{ ...styles.sectionTitle, marginTop: 24 }}>My Bookings</h2>
            {bookings.length === 0 ? (
              <p style={{ opacity: 0.8 }}>No bookings yet. Book a movie to see them here.</p>
            ) : (
              <div style={styles.bookingList}>
                {[...bookings].reverse().map((b) => (
                  <div key={b.id} style={styles.bookingCard}>
                    <div style={styles.bookingId}>{b.id}</div>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{b.movieTitle}</div>
                    <div style={styles.summaryRow}>{formatDate(b.date)} · {b.time} · {b.screen}</div>
                    <div style={styles.summaryRow}>Seats: {b.seats.join(", ")} · ${b.total.toFixed(2)}</div>
                    <div style={styles.summaryRow}>Status: <span style={{ color: "#86efac" }}>{b.status}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
