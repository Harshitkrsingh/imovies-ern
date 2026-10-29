const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  bookingCode: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
