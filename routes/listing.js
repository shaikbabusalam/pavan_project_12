const express = require("express");
const router = express.Router();
const multer = require("multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middlewares");
const { listingSchema } = require("../schema");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

async function geocodeLocation(location, country) {
  const queryText = [location, country].filter(Boolean).join(", ");
  if (!queryText) return null;

  if (geocodingClient) {
    try {
      const geoResponse = await geocodingClient
        .forwardGeocode({ query: queryText, limit: 1 })
        .send();

      if (geoResponse.body.features && geoResponse.body.features.length > 0) {
        return geoResponse.body.features[0].geometry;
      }
    } catch (err) {
      console.error("Mapbox geocoding skipped:", err.message);
    }
  }

  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryText)}`,
      { headers: { "User-Agent": "WanderlustApp/1.0" } }
    );
    const osmData = await osmRes.json();
    if (Array.isArray(osmData) && osmData.length > 0) {
      return {
        type: "Point",
        coordinates: [parseFloat(osmData[0].lon), parseFloat(osmData[0].lat)],
      };
    }
  } catch (err) {
    console.error("OSM geocoding fallback skipped:", err.message);
  }

  return null;
}

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    const err = new Error(msg);
    err.statusCode = 400;
    return next(err);
  }
  next();
};

router.get("/", async (req, res) => {
  const { q, category } = req.query;
  const filter = {};

  if (category && category.trim() !== "") {
    filter.category = category.trim();
  }

  if (q && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index", { allListings, q: q || "", category: category || "" });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const geometry = await geocodeLocation(
      req.body.listing.location,
      req.body.listing.country
    );
    if (geometry) {
      newListing.geometry = geometry;
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
});

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
});

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body.listing };

    const geometry = await geocodeLocation(
      req.body.listing.location,
      req.body.listing.country
    );
    if (geometry) {
      updateData.geometry = geometry;
    }

    const listing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  }
);

router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
});

module.exports = router;