const TaskAnalyticsService = require("../services/taskAnalytics.service");
const service = new TaskAnalyticsService();

const tasksByStatus = async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const data = await service.getStatusAnalytics(
            projectId,
            req.user.id
        );
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const tasksByUser = async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const data = await service.getUserAnalytics(
            projectId,
            req.user.id
        );
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const overdueTasks = async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const data = await service.getOverdueTasks(
            projectId,
            req.user.id
        );
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const avgCompletionTime = async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const data = await service.getAvgCompletionTime(
            projectId,
            req.user.id
        );
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    tasksByStatus,
    tasksByUser,
    overdueTasks,
    avgCompletionTime,
};
