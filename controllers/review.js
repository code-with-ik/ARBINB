const Listing = require("../models/listing");
const Review = require("../models/review");

//create review
module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
  }
  
// delete review
  module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    if (listing) {
      req.flash("success", "review deleted!");
    }
    res.redirect(`/listings/${id}`);
  }