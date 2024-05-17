// routes/reviews.js

const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");
const reviews = require("../controllers/reviews.js");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.index));

router.get("/:id/edit", isLoggedIn, catchAsync(reviews.getEditForm));

router
  .route("/:id")
  .delete(isLoggedIn, isAuthor, catchAsync(reviews.deleteReview))
  .patch(isLoggedIn, isAuthor, catchAsync(reviews.editReview));

module.exports = router;
