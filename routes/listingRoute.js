const express = require("express");
const router = express.Router();
const wrapAsync= require("../util/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const ExpressError= require("../util/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateSchema} = require("./middlewares.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloud-config.js")
const upload = multer({ storage})



router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/")
    .get(wrapAsync(listingController.index))
    .post( isLoggedIn,upload.single('listing[image]'),validateSchema, wrapAsync(listingController.createListing))
 
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,upload.single('listing[image]'),validateSchema,isOwner,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))



//update or Edit
router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync (listingController.renderEditListing))



module.exports=router;