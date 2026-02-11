exports.apply = async (req, res, next) => {
    try {
        const task = await taskRepo.getById(req.params.taskId);
        if (!task?.aiSuggestion) throw new Error("No AI suggestion");

        const updates = {
            ...task.aiSuggestion,
            aiAppliedAt: new Date(),
        };

        const updated = await taskRepo.update(task._id, updates);

        // activity log
        await taskActivityRepo.create({
            taskId: task._id,
            projectId: task.projectId,
            action: "AI_APPLIED",
            newValue: updates,
            performedBy: req.user.id,
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};
