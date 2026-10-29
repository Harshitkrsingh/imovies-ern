const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  genre: { type: String, default: "Drama" },
  language: { type: String, default: "Hindi" },
  duration: { type: String, default: "2h 10m" },
  rating: { type: Number, default: 8.0 },
  year: { type: Number, default: new Date().getFullYear() },
  poster: { type: String, default: "" },
  description: { type: String, default: "An exciting cinematic experience." },
  price: { type: Number, default: 180 },
  shows: { type: [String], default: ["10:30 AM", "2:00 PM", "6:30 PM", "9:45 PM"] }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
