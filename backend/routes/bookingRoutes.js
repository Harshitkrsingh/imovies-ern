const express = require("express");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/mine", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("movie").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not load bookings." });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { movieId, showDate, showTime, seats } = req.body;
    if (!movieId || !showDate || !showTime || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Choose a date, show time and at least one seat." });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    // Prevent the same seat being booked twice for the same movie, date and show.
    const existing = await Booking.find({
      movie: movieId, showDate, showTime, seats: { $in: seats }
    });
    const taken = new Set(existing.flatMap((booking) => booking.seats));
    const conflicts = seats.filter((seat) => taken.has(seat));
    if (conflicts.length) {
      return res.status(409).json({ message: `Already booked: ${conflicts.join(", ")}. Please choose other seats.` });
    }

    const booking = await Booking.create({
      user: req.user._id, movie: movieId, showDate, showTime, seats,
      totalAmount: movie.price * seats.length,
      bookingCode: "IM-" + crypto.randomBytes(3).toString("hex").toUpperCase()
    });
    const populated = await booking.populate("movie");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not complete booking." });
  }
});

router.get("/taken", async (req, res) => {
  try {
    const { movieId, showDate, showTime } = req.query;
    if (!movieId || !showDate || !showTime) return res.status(400).json({ message: "Missing show details." });
    const bookings = await Booking.find({ movie: movieId, showDate, showTime }).select("seats -_id");
    res.json(bookings.flatMap((booking) => booking.seats));
  } catch (error) {
    res.status(500).json({ message: "Could not load seats." });
  }
});

module.exports = router;
