// services/notification.service.js
const NotificationRepository = require("../repositories/notification.repository");

class NotificationService {
    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async notifyTaskAssigned({ userId, projectId, taskId, taskTitle }) {
        return this.notificationRepository.create({
            userId,
            projectId,
            taskId,
            type: "TASK_ASSIGNED",
            message: `You were assigned a task: "${taskTitle}"`,
        });
    }

    async notifyStatusChanged({
        userId,
        projectId,
        taskId,
        oldStatus,
        newStatus,
    }) {
        return this.notificationRepository.create({
            userId,
            projectId,
            taskId,
            type: "STATUS_CHANGED",
            message: `Task status changed from ${oldStatus} → ${newStatus}`,
        });
    }

    // 🔥 AI suggested
    async notifyAiSuggested({ userId, projectId, taskId, taskTitle }) {
        return this.notificationRepository.create({
            userId,
            projectId,
            taskId,
            type: "AI_SUGGESTED",
            message: `AI suggested updates for task "${taskTitle}"`,
            meta: { taskId },
        });
    }

    // 🔥 AI applied
    async notifyAiApplied({ userId, projectId, taskId, taskTitle }) {
        return this.notificationRepository.create({
            userId,
            projectId,
            taskId,
            type: "AI_APPLIED",
            message: `AI suggestions applied to task "${taskTitle}"`,
            meta: { taskId },
        });
    }

    async getUnread(userId) {
        return this.notificationRepository.getUnreadNotifications(userId);
    }

    async markAllRead(userId) {
        return this.notificationRepository.markAllAsRead(userId);
    }
}

module.exports = NotificationService;
