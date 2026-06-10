const Booking = require("../models/Booking");

// ── Helper: derive total price from listing price string (e.g. "$119") ──────
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
};

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const {
      listingType,
      listing,
      startDate,
      endDate,
      guests,
      totalPrice,
      paymentMethod,
      specialRequests,
    } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      listingType,
      listing,
      startDate,
      endDate,
      guests,
      totalPrice,
      paymentMethod,
      specialRequests,
    });

    const populated = await booking.populate([
      { path: "user", select: "firstName lastName email avatar" },
      { path: "listing" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings  — admin gets all, user gets own
exports.getBookings = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const { page = 1, limit = 10, status } = req.query;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("user", "firstName lastName email avatar")
      .populate("listing")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:id
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "firstName lastName email avatar")
      .populate("listing");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // Only owner or admin can view
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/status  — admin only
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/pay
exports.markAsPaid = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bookings/:id  — cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorised" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled", data: booking });
  } catch (err) {
    next(err);
  }
};
