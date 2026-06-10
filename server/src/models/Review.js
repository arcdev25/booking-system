const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listingType: {
      type: String,
      enum: ["Stay", "Car", "Experience"],
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "listingType",
      required: true,
    },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// One review per user per listing
reviewSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
