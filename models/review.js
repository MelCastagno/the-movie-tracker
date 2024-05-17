// models/review.js

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  created: {
    type: Date,
    default: Date.now,
    require: true,
  },
  score: {
    type: Number,
    require: true,
  },
  review: {
    type: String
}
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
