const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Polymorphic listing reference
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

    startDate:  { type: Date, required: true },
    endDate:    { type: Date, required: true },
    guests: {
      guestAdults:   { type: Number, default: 1 },
      guestChildren: { type: Number, default: 0 },
      guestInfants:  { type: Number, default: 0 },
    },

    totalPrice:  { type: Number, required: true },   // in dollars
    currency:    { type: String, default: "USD" },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "crypto"],
      default: "credit_card",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    specialRequests: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
