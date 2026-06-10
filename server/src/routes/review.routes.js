const router = require("express").Router();
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const { protect } = require("../middleware/auth");

// GET  /api/reviews?listing=<id>  — public
router.get("/", getReviews);

// Protected routes
router.post("/", protect, createReview);
router.put("/:id",    protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
