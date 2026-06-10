const Review  = require("../models/Review");
const Stay    = require("../models/Stay");
const Car     = require("../models/Car");
const Experience = require("../models/Experience");

// ── Helper: update avg rating on the parent listing ─────────────────────────
const updateListingRating = async (listingType, listingId) => {
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id: "$listing", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const Model = { Stay, Car, Experience }[listingType];
  if (!Model) return;

  if (stats.length > 0) {
    await Model.findByIdAndUpdate(listingId, {
      reviewStart: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Model.findByIdAndUpdate(listingId, { reviewStart: 0, reviewCount: 0 });
  }
};

// POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { listingType, listing, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      listingType,
      listing,
      rating,
      comment,
    });

    await updateListingRating(listingType, review.listing);

    const populated = await review.populate("user", "firstName lastName displayName avatar");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    // Duplicate review
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "You already reviewed this listing" });
    }
    next(err);
  }
};

// GET /api/reviews?listing=<id>
exports.getReviews = async (req, res, next) => {
  try {
    const { listing, page = 1, limit = 10 } = req.query;
    const filter = listing ? { listing } : {};

    const reviews = await Review.find(filter)
      .populate("user", "firstName lastName displayName avatar")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    const { rating, comment } = req.body;
    if (rating)  review.rating  = rating;
    if (comment) review.comment = comment;
    await review.save();

    await updateListingRating(review.listingType, review.listing);

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    const { listingType, listing } = review;
    await review.deleteOne();
    await updateListingRating(listingType, listing);

    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
