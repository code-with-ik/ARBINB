const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapTOKEN = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapTOKEN });
// index route
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index", { allListings });
};
// new route
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new");
};
//create route
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url, filename };

  listing.geometry = response.body.features[0].geometry;
  let savedListing = await listing.save();
  if (savedListing) {
    req.flash("success", "New listing created!");
  }
  res.redirect("/listings");
};
//show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested does not exits!");
    res.redirect("/listings");
  }
  res.render("./listings/show", { listing });
};
//edit route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/edit", { listing });
};
//update route
module.exports.updateListing = async (req, res) => {
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  listing.geometry = response.body.features[0].geometry
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  let savedListing = await listing.save();
  console.log(savedListing)
  req.flash("success", " listing updated!");
  res.redirect(`/listings/${id}`);
};
//destroy route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " listing deleted!");
  res.redirect("/listings");
};
