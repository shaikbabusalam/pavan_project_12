const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/Geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index =async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
   
       res.render("listings/new.ejs");
};

// module.exports.show  = async (req,res)=>{
//     let {id} = req.params;
//     const listing = await  Listing.findById(id).populate("reviews").populate("owner");
//       console.log(listing);
//     res.render("listings/show.ejs",{listing});
// };

module.exports.show =async (req,res)=>{
    let {id} = req.params;
  const listing = await  Listing.findById(req.params.id)
  .populate("reviews")
  .populate("owner");
  if(! listing){
    req.flash("error","Listing you requested for does not exist!");
    return  res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});
}


module.exports.create = async (req,res,next)=>{
 let response =  await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
  console.log(response.body.features[0].geometry);
  res.send("done");

let url = req.file.path;
let filename = req.file.filename;
console.log(url, "..", filename);
let newListing = new Listing (req.body.listing);
newListing.owner = req.user._id;
newListing.image={url,filename};
newListing.geometry = response.body.features[0].geometry;
   let savedListing = await newListing.save();
   console.log(savedListing);
    req.flash("success", "new listing created pavan");
    res.redirect("/listings");
    
};

module.exports.edit = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "new listing edited pavan");

    res.render("listings/edit.ejs",{listing});
};

module.exports.update = async (req,res)=>{
    let {id} = req.params;
   await  Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
  let deleteListing = await  Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   req.flash("success", " listing deleted pavan");
    res.redirect("/listings");
};