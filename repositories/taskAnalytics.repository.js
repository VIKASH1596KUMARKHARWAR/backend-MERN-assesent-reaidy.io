const Task = require("../models/task.model");

class TaskAnalyticsRepository {
    /** Tasks count by status */
    async tasksByStatus(projectId) {
        return Task.aggregate([
            { $match: { projectId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
    }

    /** Tasks count by assignee */
    async tasksByUser(projectId) {
        return Task.aggregate([
            { $match: { projectId, assignedTo: { $ne: null } } },
            {
                $group: {
                    _id: "$assignedTo",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    userId: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    count: 1,
                },
            },
        ]);
    }

    /** Overdue tasks */
    async overdueTasks(projectId) {
        return Task.find({
            projectId,
            dueDate: { $lt: new Date() },
            status: { $ne: "DONE" },
        });
    }

    /** Avg completion time (ms) */
    async avgCompletionTime(projectId) {
        return Task.aggregate([
            {
                $match: {
                    projectId,
                    status: "DONE",
                },
            },
            {
                $project: {
                    duration: {
                        $subtract: ["$updatedAt", "$createdAt"],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDuration: { $avg: "$duration" },
                },
            },
        ]);
    }
}

module.exports = TaskAnalyticsRepository;
