require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Movie = require("./models/Movie");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://imovies-ern.vercel.app"
  ]
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "IMovies API" }));
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);

const sampleMovies = [
  { title: "Interstellar", genre: "Sci-Fi", language: "English", duration: "2h 49m", rating: 8.7, year: 2014, price: 220, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", description: "A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars." },
  { title: "Inception", genre: "Sci-Fi", language: "English", duration: "2h 28m", rating: 8.8, year: 2010, price: 200, poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", description: "A skilled thief enters people's dreams to steal secrets and is offered a chance to have his criminal history erased." },
  { title: "Dangal", genre: "Drama", language: "Hindi", duration: "2h 41m", rating: 8.3, year: 2016, price: 180, poster: "https://image.tmdb.org/t/p/w500/cJRPOLE3eI7W4e7wDykF3LTc6Y.jpg", description: "A former wrestler trains his daughters to become world-class wrestlers." },
  { title: "Jawan", genre: "Action", language: "Hindi", duration: "2h 49m", rating: 7.0, year: 2023, price: 190, poster: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg", description: "A man driven by a personal vendetta sets out to correct the wrongs in society." },
  { title: "The Batman", genre: "Action", language: "English", duration: "2h 56m", rating: 7.8, year: 2022, price: 210, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", description: "Batman explores corruption in Gotham City while pursuing a mysterious serial killer." },
  { title: "3 Idiots", genre: "Comedy", language: "Hindi", duration: "2h 50m", rating: 8.4, year: 2009, price: 170, poster: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg", description: "Three engineering students navigate college life, friendship and pressure to succeed." },
  { title: "Avatar: The Way of Water", genre: "Fantasy", language: "English", duration: "3h 12m", rating: 7.6, year: 2022, price: 240, poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", description: "Jake Sully and Neytiri protect their family amid new threats on Pandora." },
  { title: "Pathaan", genre: "Action", language: "Hindi", duration: "2h 26m", rating: 5.9, year: 2023, price: 190, poster: "https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9Yigq6k7.jpg", description: "An exiled agent returns to stop a major threat to national security." }
];

async function start() {
  const port = process.env.PORT || 5000;
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/imovies";
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    if (await Movie.countDocuments() === 0) {
      await Movie.insertMany(sampleMovies);
      console.log("Sample movies inserted");
    }
    app.listen(port, () => console.log(`IMovies API running at http://localhost:${port}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
