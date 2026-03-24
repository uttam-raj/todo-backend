const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const {getUserProfile,updateProfile,deleteAccount,} = require("../controllers/settingsController");

// Fetch profile
router.get("/profile", authenticate, getUserProfile);
// Update profile (name, email, phone, gender, profileImage)
router.put("/profile", authenticate, updateProfile);
// Delete account
router.delete("/delete", authenticate, deleteAccount);

module.exports = router;
