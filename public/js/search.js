const config = require('../../utils/config');

module.exports.searchPopular = () => {
    return `${config.BASE_URL}/discover/movie?sort_by=popularity.desc&${config.API_KEY}`
};

module.exports.searchByName = (movieName) => {
    return`${config.BASE_URL}/search/movie?${config.API_KEY}&query=${movieName}`
};

module.exports.searchById = (movieId) => {
    return`${config.BASE_URL}/movie/${movieId}?${config.API_KEY}`
};

module.exports.searchByGenre = (genre) => {
    return `${config.BASE_URL}/discover/movie?language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}&${config.API_KEY}`
};