const TaskService = require("../services/task.service");
const taskService = new TaskService();

/** CREATE */
const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (err) {
        next(err);
    }
};

/** LIST (KANBAN / BOARD) */
const getTasks = async (req, res, next) => {
    try {
        const { projectId } = req.body;

        const tasks = await taskService.getTasks(
            projectId,
            req.user.id
        );

        res.json({
            success: true,
            data: tasks,
        });
    } catch (err) {
        next(err);
    }
};

/** UPDATE */
const updateTask = async (req, res, next) => {
    try {
        const { taskId, projectId, ...updateData } = req.body;

        const task = await taskService.updateTask(
            taskId,
            projectId,
            updateData,
            req.user.id
        );

        res.json({
            success: true,
            data: task,
        });
    } catch (err) {
        next(err);
    }
};

/** DELETE */
const deleteTask = async (req, res, next) => {
    try {
        const { taskId, projectId } = req.body;

        await taskService.deleteTask(
            taskId,
            projectId,
            req.user.id
        );

        res.json({
            success: true,
            message: "Task deleted",
        });
    } catch (err) {
        next(err);
    }
};

/** ASSIGN */
const assignTask = async (req, res, next) => {
    try {
        const { taskId, projectId, assignedTo } = req.body;

        const task = await taskService.assignTask(
            taskId,
            projectId,
            assignedTo,
            req.user.id
        );

        res.json({
            success: true,
            data: task,
        });
    } catch (err) {
        next(err);
    }
};

const applyAiSuggestion = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const updatedTask = await taskService.applyAiSuggestion(taskId, userId);

        res.json({ success: true, data: updatedTask });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask,
    applyAiSuggestion
};
