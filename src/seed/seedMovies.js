import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.js"

const MOVIES = [
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

// Theatres
const THEATRES = [
    {
        id: "theatre_1",
        name: "Grand Cinema",
        location: "Downtown"
    },
    {
        id: "theatre_2",
        name: "City Plex",
        location: "Mall Road"
    },
    {
        id: "theatre_3",
        name: "IMAX Arena",
        location: "Tech Park"
    }
];

// Showtimes (movie ↔ theatre mapping)
const SHOWTIMES = [
    {
        id: "show_1",
        movieId: "movie_1",
        theatreId: "theatre_1",
        time: "10:30"
    },
    {
        id: "show_2",
        movieId: "movie_1",
        theatreId: "theatre_1",
        time: "18:45"
    },
    {
        id: "show_3",
        movieId: "movie_1",
        theatreId: "theatre_2",
        time: "20:30"
    },
    {
        id: "show_4",
        movieId: "movie_4",
        theatreId: "theatre_1",
        time: "21:00"
    },
    {
        id: "show_5",
        movieId: "movie_2",
        theatreId: "theatre_3",
        time: "16:30"
    },
    {
        id: "show_6",
        movieId: "movie_6",
        theatreId: "theatre_2",
        time: "14:00"
    },
    {
        id: "show_7",
        movieId: "movie_25",
        theatreId: "theatre_1",
        time: "19:15"
    },
    {
        id: "show_8",
        movieId: "movie_5",
        theatreId: "theatre_2",
        time: "22:00"
    },
    {
        id: "show_9",
        movieId: "movie_9",
        theatreId: "theatre_3",
        time: "20:45"
    },
    {
        id: "show_10",
        movieId: "movie_7",
        theatreId: "theatre_1",
        time: "17:00"
    }
];


function generateseats(showTimeID) {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    rows.forEach((row) => {
        for (let col = 1; col <= 10; col++) {
            seats.push({
                id: `${showTimeID}_${row}${col}`,
                showTimeID: showTimeID,
                sheatID: `${row}${col}`,
                status: "available",
                lockedBy: null,
                lockedAt: null,
                bookingId: null,
                type: (row === 'A' || row === 'B') ? 'VIP' : 'Regular',
            })
        };
    });
    return seats;
}



//seed data stored
export async function seedFirestore() {
    const movieRef = collection(db, "movies");
    const existingMovies = await getDocs(movieRef);

    // Only seed if database is empty (prevents quota issues)
    if (existingMovies.size > 0) {
        console.log("Movies already seeded, skipping...");
        return;
    }

    console.log("starting the seeding process......")

    // seed/writing the movies in database
    for (const movie of MOVIES) {
        await setDoc(doc(db, "movies", movie.id), movie);
    }

    console.log("seeding process complete.......")

    // seed theatres
    for (const theatre of THEATRES) {
        await setDoc(doc(db, "theatres", theatre.id), theatre);
    }

    console.log("thearts seeded...");

    // seed showtimes
    for (const showtime of SHOWTIMES) {
        await setDoc(doc(db, "showtimes", showtime.id), showtime);
    }

    console.log("showtimes seeded...");

    // writing seeds

    for (const showtime of SHOWTIMES) {
        const seats = generateseats(showtime.id);
        for (const seat of seats) {
            await setDoc(doc(db, "seats", seat.id), seat);
        }
    }

    console.log("seats created...");

    console.log("seeding complete on firebase !!!")
}
