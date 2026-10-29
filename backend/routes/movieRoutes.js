const express = require("express");
const Movie = require("../models/Movie");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (genre && genre !== "All") filter.genre = genre;
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Could not load movies." });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, genre, language, duration, rating, year, poster, description, price, shows } = req.body;
    if (!title) return res.status(400).json({ message: "Movie title is required." });
    const movie = await Movie.create({
      title, genre, language, duration, rating: Number(rating) || 8, year: Number(year) || new Date().getFullYear(),
      poster, description, price: Number(price) || 180,
      shows: Array.isArray(shows) && shows.length ? shows : ["10:30 AM", "2:00 PM", "6:30 PM", "9:45 PM"]
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Could not add movie." });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json({ message: "Movie deleted." });
  } catch (error) {
    res.status(400).json({ message: "Invalid movie ID." });
  }
});

module.exports = router;
