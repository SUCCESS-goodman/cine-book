import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

// Movies Collection
export const getAllMovies = async () => {
    const moviesRef = collection(db, "movies");
    const snapshot = await getDocs(moviesRef);
    console.log("FIRESTORE: getAllMovies found", snapshot.docs.length, "movies");
    const movies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("FIRESTORE: Movies data:", movies);
    return movies;
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
    console.log("FIRESTORE: Saving booking for user:", bookingData.userId);
    try {
        const docRef = await addDoc(bookingsRef, {
            ...bookingData,
            createdAt: new Date().toISOString(),
        });
        console.log("FIRESTORE: Booking saved with ID:", docRef.id);
        return {
            id: docRef.id,
            ...bookingData,
        };
    } catch (error) {
        console.error("FIRESTORE ERROR in createBooking:", error);
        throw error; // Critical - re-throw so UI can catch it
    }
};

export const getUserBookings = async (userId) => {
    console.log("FIRESTORE: Querying bookings for userId:", userId);
    const bookingsRef = collection(db, "bookings");
    // Temporarily removed orderBy to avoid composite index requirement
    // Will re-add once we confirm basic query works
    const q = query(
        bookingsRef,
        where("userId", "==", userId)
    );
    try {
        const snapshot = await getDocs(q);
        console.log("FIRESTORE: Found", snapshot.docs.length, "bookings");
        const bookings = snapshot.docs.map(doc => ({
            id: doc.id, // ✅ REQUIRED for delete/update
            ...doc.data()
        }));
        console.log("FIRESTORE: Bookings data:", bookings);
        return bookings;
    } catch (error) {
        console.error("FIRESTORE ERROR:", error);
        // If error, try without query
        console.log("FIRESTORE: Trying to fetch all bookings to debug");
        const allSnapshot = await getDocs(bookingsRef);
        console.log("FIRESTORE: Total bookings in collection:", allSnapshot.docs.length);
        allSnapshot.docs.forEach(doc => {
            console.log("FIRESTORE: Booking:", doc.id, doc.data());
        });
        throw error;
    }
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

export const deleteBooking = async (bookingId) => {
    console.log("FIRESTORE: Attempting to delete booking:", bookingId);
    const bookingRef = doc(db, "bookings", bookingId);
    try {
        await deleteDoc(bookingRef);
        console.log("FIRESTORE: Booking deleted successfully:", bookingId);
    } catch (error) {
        console.error("FIRESTORE ERROR in deleteBooking:", error);
        throw error; // Critical - re-throw so UI can catch it
    }
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
