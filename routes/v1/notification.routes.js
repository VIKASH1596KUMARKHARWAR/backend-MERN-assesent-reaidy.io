const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middleware/auth.middleware");
const {
    getMyNotifications,
    markAsRead,
    getUnreadNotifications,
    markAllRead,
} = require("../../controllers/notification.controller");

// Get all notifications
router.get("/me", authenticate, getMyNotifications);

// Mark single notification as read
router.post("/read", authenticate, markAsRead);

// Get unread notifications
router.get("/unread", authenticate, getUnreadNotifications);

// Mark all notifications as read
router.patch("/mark-all-read", authenticate, markAllRead);

module.exports = router;
