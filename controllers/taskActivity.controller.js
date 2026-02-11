const TaskActivityService = require("../services/taskActivity.service");
const service = new TaskActivityService();

const getTaskActivity = async (req, res, next) => {
    try {
        const { taskId, projectId } = req.body;

        const data = await service.getTaskActivity(
            taskId,
            projectId,
            req.user.id
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const getProjectActivity = async (req, res, next) => {
    try {
        const { projectId } = req.body;

        const data = await service.getProjectActivity(
            projectId,
            req.user.id
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTaskActivity,
    getProjectActivity,
};
