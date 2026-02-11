const CrudRepository = require("./crud.repository");
const { Notification } = require("../models");

class NotificationRepository extends CrudRepository {
    constructor() {
        super(Notification);
    }

    getUserNotifications(userId) {
        return Notification.find({ userId })
            .sort({ createdAt: -1 });
    }

    getUnreadNotifications(userId) {
        return Notification.find({
            userId,
            isRead: false,
        }).sort({ createdAt: -1 });
    }

    markAsRead(notificationId, userId) {
        return Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );
    }

    markAllAsRead(userId) {
        return Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );
    }
}

module.exports = NotificationRepository;
