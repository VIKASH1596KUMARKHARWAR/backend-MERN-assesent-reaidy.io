const express = require("express");
const {
    getProfile,
    getAllUsers,
} = require("../../controllers/user.controller");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

// DEBUG (temporary)
console.log("getProfile:", getProfile);
console.log("getAllUsers:", getAllUsers);

router.get("/me", authenticate, getProfile);
router.get("/", authenticate, getAllUsers);

module.exports = router;
