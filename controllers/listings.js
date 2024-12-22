const Listing = require("../models/listing.js");


module.exports.index=async (req,res)=>{
    const allData = await Listing.find({});
    res.render("listings/index",{allData});
}

module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new");
}

module.exports.showListing=async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}

module.exports.createListing=async (req,res,next)=>{
  let url = req.file.path;
  let filename = req.file.filename;
 
    const NL = new Listing(req.body.listing)
    NL.image={url,filename};
    NL.owner=req.user._id;
    await NL.save();
   req.flash("success","New Listing created !");
     res.redirect("/listings");


}

module.exports.renderEditListing=async (req,res)=>{
   
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist !");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload","upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const {id} = req.params;
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
    
    req.flash("success"," Listing updated !");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing=async (req,res)=>{
    const {id} = req.params;
    const DL = await Listing.findByIdAndDelete(id);
    console.log(DL)
    req.flash("success"," Listing deleted !");
    res.redirect(`/listings`)
}

