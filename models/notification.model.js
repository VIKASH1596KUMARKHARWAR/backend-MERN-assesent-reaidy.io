// models/notification.model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },

        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },

        type: {
            type: String,
            enum: [
                "TASK_ASSIGNED",
                "STATUS_CHANGED",
                "AI_SUGGESTED",   // ✅ NEW
                "AI_APPLIED",     // ✅ NEW
            ],
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        // 🔥 optional but powerful (frontend deep link)
        meta: {
            type: Object,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
