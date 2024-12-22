const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const ExpressError= require("../util/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to add new listing");
        return res.redirect("/login")
    }  
    next();  
}

module.exports.isOwner= async (req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error"," You don't have access");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; // Ensure the parameter name matches the route definition
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!res.locals.curruser || !review.author || !review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You don't have access");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateSchema = (req,res,next)=>{
    
    const {error} = listingSchema.validate(req.body);
  
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    
    const {error} = reviewSchema.validate(req.body);
  
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
}
