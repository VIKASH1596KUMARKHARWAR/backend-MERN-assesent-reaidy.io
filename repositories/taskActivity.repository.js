const CrudRepository = require("./crud.repository");
const TaskActivity = require("../models/taskActivity.model");

class TaskActivityRepository extends CrudRepository {
    constructor() {
        super(TaskActivity);
    }

    getByTask(taskId) {
        return TaskActivity.find({ taskId })
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 });
    }

    getByProject(projectId) {
        return TaskActivity.find({ projectId })
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 });
    }
}

module.exports = TaskActivityRepository;
