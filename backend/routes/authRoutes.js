const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  setProfilePic,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post(
  "/uploadprofilepic",
  protect,
  upload.single("profileImage"),
  setProfilePic,
);

module.exports = router;
