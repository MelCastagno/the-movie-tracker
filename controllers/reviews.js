// controllers/reviews.js

const Review = require("../models/review");
const search = require('../public/js/search');
const config = require('../utils/config');

module.exports.index = async (req, res, next) => {
    if (req.isAuthenticated()){
      const newReview = new Review(req.body.review);
      newReview.user = req.user._id;
      await newReview.save();
      res.redirect(`/movie/${newReview.movieId}`);
    }else{
      req.flash('error', "You need to log in.")
      res.redirect('/users/login')
    }
   
  };

  module.exports.getEditForm = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    const lists = req.user.lists;
    const fetchmovie = await fetch(search.searchById(review.movieId));
    const movie = await fetchmovie.json();
    res.render(`reviews/edit`, { review, lists, movie, config});
  }

  module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    let deleteReview = await Review.findByIdAndDelete(id);
    res.redirect(`/movie/${deleteReview.movieId}`);
  };

  module.exports.editReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
    res.redirect(`/movie/${review.movieId}`);
  };