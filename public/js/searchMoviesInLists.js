const Review = require("../../models/review");
const config = require('../../utils/config');
const search = require('./search');


const getImgPath = (poster_path) => `${config.IMG_URL}${poster_path}`
const formatAddedTime = (added) => added.toISOString().slice(0, 10)

const getMovieDataFromAPI = async (movieId) => {
    const response = await fetch(search.searchById(movieId));
    const movieObject = await response.json();
    return movieObject
}

const getAllMovieData = async (movie) => {
    const movieObject = await getMovieDataFromAPI(movie.movieId)
    movieObject.movieId = movie.movieId.trim();
    movieObject._id = movie._id;
    movieObject.imgPath = getImgPath(movieObject.poster_path)
    movieObject.added = formatAddedTime(movie.added)
    return movieObject
}

module.exports.getUpgradedLists = async (user) => {
    const lists = user.lists
    const upgradedLists = [];
    for (const list of lists) {
        const movies = [];
        for (const movie of list.movies) {
            movieObject = await getAllMovieData(movie)
            const reviewSearchObj = { movieId: movie.movieId.replace(/\s/g, ''), user: user._id }
            const userReview = await Review.findOne(reviewSearchObj);
            movieObject.review = userReview;
            movies.push(movieObject);
        }
        upgradedLists.push({  ...list.toObject(), movies })
    }
    return upgradedLists
}

