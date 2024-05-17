//middleware
const { reviewSchema,  userSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Review = require('./models/review');

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/users/login');
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
  console.log(req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const review = await Review.findById(id);
    if (!review.user.equals(req.user._id)){
      req.flash('error', 'Permission denied');
      return res.redirect(`/movie/&{id}`);
    }
    next();
  };

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };