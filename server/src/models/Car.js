const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:  { type: String, required: true, trim: true },
    featuredImage: { type: String, default: "" },
    galleryImgs:   [{ type: String }],
    address:       { type: String, required: true },
    price:         { type: String, required: true },   // e.g. "$119"
    listingCategory: {
      name:  { type: String },
      href:  { type: String },
      color: { type: String },
    },
    seats:       { type: Number, required: true },
    gearshift:   { type: String, enum: ["Automatic", "Manual"], default: "Automatic" },
    reviewStart: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    viewCount:   { type: Number, default: 0 },
    commentCount:{ type: Number, default: 0 },
    like:        { type: Boolean, default: false },
    saleOff:     { type: String, default: null },
    isAds:       { type: Boolean, default: false },
    map: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

carSchema.index({ address: "text", title: "text" });

module.exports = mongoose.model("Car", carSchema);
