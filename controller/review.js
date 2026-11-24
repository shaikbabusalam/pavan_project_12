const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{
   
  let  listing  =  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
   
  
    console.log("review added");
       req.flash("success", " listing review added pavan");

   res.redirect(`/listings/${listing._id}`);


};

module.exports.delete = async(req,res)=>{
    let {id,reviewsId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
    
    res.redirect(`/listings/${id}`);
};