// routes/movies.js

const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const movies = require('../controllers/movies');

router.route('/home')
  .get(catchAsync( movies.getPopularMovies))
  .post(catchAsync( movies.getMovieByName));

router.get("/movie/:id", catchAsync(movies.showMovie));

module.exports = router;