const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../util/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const ExpressError= require("../util/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isAuthor} = require("./middlewares.js");
const reviewController = require("../controllers/reviews.js");
//reviews
router.post("/",isLoggedIn, validateReview,wrapAsync (reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;