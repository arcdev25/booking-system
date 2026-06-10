const router = require("express").Router();
const {
  getStays,
  getStay,
  createStay,
  updateStay,
  deleteStay,
} = require("../controllers/stay.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", getStays);
router.get("/:id", getStay);

// Protected
router.post("/", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), createStay);

router.put("/:id", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), updateStay);

router.delete("/:id", protect, deleteStay);

module.exports = router;
