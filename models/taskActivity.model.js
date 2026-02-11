const mongoose = require("mongoose");

const taskActivitySchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        action: {
            type: String,
            enum: [
                "TASK_CREATED",
                "TASK_ASSIGNED",
                "STATUS_CHANGED",
                "PRIORITY_CHANGED",
            ],
            required: true,
        },

        oldValue: {
            type: mongoose.Schema.Types.Mixed,
        },

        newValue: {
            type: mongoose.Schema.Types.Mixed,
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

taskActivitySchema.index({ taskId: 1 });
taskActivitySchema.index({ projectId: 1 });
taskActivitySchema.index({ action: 1 });

module.exports = mongoose.model("TaskActivity", taskActivitySchema);
