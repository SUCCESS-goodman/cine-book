import { STORAGE_KEY, ROWS } from "../constants/movieBooking.js";

export function getBookingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookingToStorage(booking) {
  const list = getBookingsFromStorage();
  list.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function formatDate(str) {
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function generateSeatId(rowIndex, colIndex) {
  return `${ROWS[rowIndex]}${colIndex + 1}`;
}
