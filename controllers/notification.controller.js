// controllers/notification.controller.js

const NotificationService = require("../services/notification.service");
const service = new NotificationService();

const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await service.notificationRepository
            .getUserNotifications(req.user.id);

        res.json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

// 🔥 NEW
const getUnreadNotifications = async (req, res, next) => {
    try {
        const notifications = await service.getUnread(req.user.id);
        res.json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const notification = await service.notificationRepository.markAsRead(
            req.body.notificationId,
            req.user.id
        );

        res.json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
};

// 🔥 NEW
const markAllRead = async (req, res, next) => {
    try {
        await service.markAllRead(req.user.id);
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMyNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllRead,
};
