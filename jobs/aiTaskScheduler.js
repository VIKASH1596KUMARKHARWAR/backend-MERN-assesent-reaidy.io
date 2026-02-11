const cron = require("node-cron");
const TaskRepository = require("../repositories/task.repository");
const TaskAiService = require("../services/ai/taskAi.service");

const taskRepo = new TaskRepository();
const aiService = new TaskAiService();

// Every 1 hour
cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const soon = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const tasks = await taskRepo.find({
        status: { $ne: "DONE" },
        $or: [
            { assignedTo: null },
            { dueDate: { $lt: soon } },
        ],
    });

    for (const task of tasks) {
        if (task.aiSuggestedAt) continue; // cost guard

        try {
            const suggestion = await aiService.suggest(task._id);

            await taskRepo.update(task._id, {
                aiSuggestion: suggestion,
                aiSuggestedAt: new Date(),
            });
        } catch (e) {
            console.error("AI failed:", task._id);
        }
    }
});
