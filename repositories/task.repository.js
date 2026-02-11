const CrudRepository = require("./crud.repository");
const { Task } = require("../models");

class TaskRepository extends CrudRepository {
    constructor() {
        super(Task);
    }

    getByProject(projectId) {
        return Task.find({ projectId })
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .lean();   // 🔥 VERY IMPORTANT
    }

    async getByProjectWithFilters(projectId, filters = {}) {
        const query = { projectId };

        if (filters.status) query.status = filters.status;
        if (filters.priority) query.priority = filters.priority;
        if (filters.assignedTo) query.assignedTo = filters.assignedTo;

        return Task.find(query)
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 })
            .lean();   // 🔥 VERY IMPORTANT
    }

    // 🚀 FAST STATUS UPDATE (used by drag)
    async updateStatus(taskId, status) {
        return Task.findByIdAndUpdate(
            taskId,
            { $set: { status } },
            { new: true }
        ).lean();
    }
}

module.exports = TaskRepository;

