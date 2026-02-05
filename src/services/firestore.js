import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

// Movies Collection
export const getAllMovies = async () => {
    const moviesRef = collection(db, "movies");
    const snapshot = await getDocs(moviesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getMovieById = async (id) => {
    const movieRef = doc(db, "movies", id);
    const snapshot = await getDoc(movieRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

export const getMoviesByStatus = async (status) => {
    const moviesRef = collection(db, "movies");
    const q = query(moviesRef, where("status", "==", status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Bookings Collection
export const createBooking = async (bookingData) => {
    const bookingsRef = collection(db, "bookings");
    const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        createdAt: new Date().toISOString(),
    });
    return docRef.id;
};

export const getUserBookings = async (userId) => {
    const bookingsRef = collection(db, "bookings");
    const q = query(
        bookingsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getBookingById = async (bookingId) => {
    const bookingRef = doc(db, "bookings", bookingId);
    const snapshot = await getDoc(bookingRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

export const cancelBooking = async (bookingId) => {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
    });
};

// Theatres Collection
export const getAllTheatres = async () => {
    const theatresRef = collection(db, "theatres");
    const snapshot = await getDocs(theatresRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getTheatreById = async (id) => {
    const theatreRef = doc(db, "theatres", id);
    const snapshot = await getDoc(theatreRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

// Showtimes Collection
export const getShowtimesByMovie = async (movieId) => {
    const showtimesRef = collection(db, "showtimes");
    const q = query(showtimesRef, where("movieId", "==", movieId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getShowtimeById = async (id) => {
    const showtimeRef = doc(db, "showtimes", id);
    const snapshot = await getDoc(showtimeRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

// Seats Collection
export const getSeatsByShowtime = async (showtimeId) => {
    const seatsRef = collection(db, "seats");
    const q = query(seatsRef, where("showtimeId", "==", showtimeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateSeatStatus = async (seatId, status, bookingId = null) => {
    const seatRef = doc(db, "seats", seatId);
    await updateDoc(seatRef, {
        status,
        bookingId,
        updatedAt: new Date().toISOString(),
    });
};

// Users Collection
export const getUserById = async (userId) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

export const updateUserProfile = async (userId, data) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
};
