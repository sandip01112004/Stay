const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => { // Create a review
    const review = new Review(req.body.review);
    const listing = await Listing.findById(req.params.id);
    review.author = req.user._id;
    listing.reviews.push(review);
    await listing.save();
   
    await review.save();
    req.flash("success", "Review created !");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review deleted !");
    res.redirect(`/listings/${id}`);

}