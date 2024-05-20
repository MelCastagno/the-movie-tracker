
const Review = require("../models/review");
const search = require('../public/js/search');
const config = require('../utils/config')


module.exports.showMovie = async (req, res) => {
    const { id } = req.params;
    const response = await fetch(search.searchById(id));
    const movie = await response.json();
    let lists;
    if (req.isAuthenticated()){
       lists = req.user.lists;
    }
    const reviews = await Review.find({ movieId: id }).populate('user');
    let genres = '';
    for (let g of movie.genres){
      genres += g.id + ',';
   };

    genres = genres.substring(0, genres.length -1);
    const searchSimilar = await fetch(search.searchByGenre(genres));
    const similarMovies = await searchSimilar.json();
   
    res.render("movie", { movie, reviews, lists, config, id, similarMovies: similarMovies.results});
  };


  module.exports.getPopularMovies = async (req, res) => {
   const response = await fetch(search.searchPopular());
   const movies = await response.json();
   res.render('home', {movies: movies.results, config});
  };

  module.exports.getMovieByName = async (req, res) => {
   const query  = req.body.query;
   const response = await fetch(search.searchByName(query));
   const movies = await response.json();
   res.render('home', {movies: movies.results, config});
  };


  