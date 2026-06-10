const router = require("express").Router();
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/", getCars);
router.get("/:id", getCar);

// Protected
router.post("/", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), createCar);

router.put("/:id", protect, upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImgs",   maxCount: 10 },
]), updateCar);

router.delete("/:id", protect, deleteCar);

module.exports = router;
