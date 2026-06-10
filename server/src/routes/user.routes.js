const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes require authentication
router.use(protect);

// GET  /api/users        — admin only
// GET  /api/users/:id    — any authenticated user
// PUT  /api/users/:id    — owner or admin
// DELETE /api/users/:id  — admin only

router.get("/", restrictTo("admin"), getAllUsers);
router.get("/:id", getUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

module.exports = router;
