const router = require("express").Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  markAsPaid,
  cancelBooking,
} = require("../controllers/booking.controller");
const { protect, restrictTo } = require("../middleware/auth");

// All booking routes require authentication
router.use(protect);

// POST /api/bookings            — create booking
// GET  /api/bookings            — list (admin=all, user=own)
router.route("/").post(createBooking).get(getBookings);

// GET    /api/bookings/:id       — view single
// DELETE /api/bookings/:id       — cancel
router.route("/:id").get(getBooking).delete(cancelBooking);

// PATCH /api/bookings/:id/status — admin changes status
router.patch("/:id/status", restrictTo("admin"), updateBookingStatus);

// PATCH /api/bookings/:id/pay   — mark as paid
router.patch("/:id/pay", markAsPaid);

module.exports = router;
