const router = require("express").Router();
const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experience.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", getExperiences);
router.get("/:id", getExperience);

// Protected
router.post("/", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), createExperience);

router.put("/:id", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), updateExperience);

router.delete("/:id", protect, deleteExperience);

module.exports = router;
