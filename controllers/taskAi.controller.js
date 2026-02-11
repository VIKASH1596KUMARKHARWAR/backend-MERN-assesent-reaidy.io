const TaskAiService = require("../services/ai/taskAi.service");
const TaskRepository = require("../repositories/task.repository");

const aiService = new TaskAiService();
const taskRepo = new TaskRepository();

const suggest = async (req, res, next) => {
    try {
        const suggestion = await aiService.suggest(req.params.taskId);

        await taskRepo.update(req.params.taskId, {
            aiSuggestion: suggestion,
            aiSuggestedAt: new Date(),
        });

        res.json({ success: true, data: suggestion });
    } catch (err) {
        next(err);
    }
};
module.exports = { suggest };
