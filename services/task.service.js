const TaskRepository = require("../repositories/task.repository");
const ProjectMemberRepository = require("../repositories/projectMember.repository");
const TaskActivityRepository = require("../repositories/taskActivity.repository");
const NotificationService = require("./notification.service");
const TaskAiService = require("./ai/taskAi.service"); // ✅ ADD THIS
const PERMISSIONS = require("../config/permissions");

const MEMBER_ALLOWED_FIELDS = ["status", "description"];

class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository();
        this.projectMemberRepository = new ProjectMemberRepository();
        this.taskActivityRepository = new TaskActivityRepository();
        this.notificationService = new NotificationService();
        this.taskAiService = new TaskAiService(); // ✅ ADD THIS
    }

    /** CREATE TASK */
    async createTask(data, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                data.projectId,
                userId
            );

        if (!member || !PERMISSIONS[member.role]?.TASK_CREATE) {
            throw new Error("Not authorized to create task");
        }

        const task = await this.taskRepository.create({
            ...data,
            createdBy: userId,
        });

        // 🔥 TASK CREATED ACTIVITY
        await this.taskActivityRepository.create({
            taskId: task._id,
            projectId: task.projectId,
            action: "TASK_CREATED",
            newValue: {
                title: task.title,
                status: task.status,
                priority: task.priority,
            },
            performedBy: userId,
        });

        // 🚀 fire-and-forget AI (NON BLOCKING)
        this.taskAiService.suggest(task._id).catch(err =>
            console.error("AI auto-suggest failed:", err.message)
        );

        return task;
    }

    /** GET TASKS */
    async getTasks(projectId, userId, filters = {}) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member) {
            throw new Error("Not a project member");
        }

        return this.taskRepository.getByProjectWithFilters(projectId, filters);
    }

    /** UPDATE TASK */
/** UPDATE TASK */
async updateTask(taskId, projectId, updateData, userId) {
    const member =
        await this.projectMemberRepository.findAcceptedMember(
            projectId,
            userId
        );

    if (!member) {
        throw new Error("Not a project member");
    }

    const task = await this.taskRepository.getById(taskId);
    if (!task) throw new Error("Task not found");

    if (!["OWNER", "MANAGER"].includes(member.role)) {
        if (String(task.assignedTo) !== String(userId)) {
            throw new Error("Members can update only their own tasks");
        }
    }

    const updatedTask = await this.taskRepository.update(taskId, updateData);

    // 🔥 STATUS CHANGE (non-blocking)
    if (updateData.status && updateData.status !== task.status) {
        this.taskActivityRepository.create({
            taskId,
            projectId,
            action: "STATUS_CHANGED",
            oldValue: task.status,
            newValue: updateData.status,
            performedBy: userId,
        }).catch(() => {});

        if (task.assignedTo) {
            this.notificationService.notifyStatusChanged({
                userId: task.assignedTo,
                projectId,
                taskId,
                oldStatus: task.status,
                newStatus: updateData.status,
            }).catch(() => {});
        }
    }

    // 🔥 PRIORITY CHANGE (non-blocking)
    if (updateData.priority && updateData.priority !== task.priority) {
        this.taskActivityRepository.create({
            taskId,
            projectId,
            action: "PRIORITY_CHANGED",
            oldValue: task.priority,
            newValue: updateData.priority,
            performedBy: userId,
        }).catch(() => {});
    }

    return updatedTask;
}



    /** DELETE TASK */
    async deleteTask(taskId, projectId, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member || !["OWNER", "MANAGER"].includes(member.role)) {
            throw new Error("Not authorized to delete task");
        }

        return this.taskRepository.delete(taskId);
    }

    /** ASSIGN TASK */
    async assignTask(taskId, projectId, assignedTo, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member || !["OWNER", "MANAGER"].includes(member.role)) {
            throw new Error("Not authorized to assign task");
        }

        const task = await this.taskRepository.getById(taskId);

        const updatedTask = await this.taskRepository.update(taskId, {
            assignedTo,
        });

        await this.taskActivityRepository.create({
            taskId,
            projectId,
            action: "TASK_ASSIGNED",
            oldValue: task.assignedTo,
            newValue: assignedTo,
            performedBy: userId,
        });

        await this.notificationService.notifyTaskAssigned({
            userId: assignedTo,
            projectId,
            taskId,
            taskTitle: task.title,
        });

        return updatedTask;
    }

    /** APPLY AI SUGGESTION */
    // services/task.service.js
    async applyAiSuggestion(taskId, userId) {
        const task = await this.taskRepository.getById(taskId);
        if (!task || !task.aiSuggestion) {
            throw new Error("No AI suggestion available");
        }

        const updated = await this.taskRepository.update(taskId, {
            priority: task.aiSuggestion.priority,
            assignedTo: task.aiSuggestion.assignedTo,
            dueDate: task.aiSuggestion.dueDate,
            generatedByAI: true,
            aiSource: "FULL_TASK",
            aiAppliedAt: new Date(),
        });

        // 🔔 notify assigned user
        if (updated.assignedTo) {
            await this.notificationService.notifyAiApplied({
                userId: updated.assignedTo,
                projectId: updated.projectId,
                taskId,
                taskTitle: updated.title,
            });
        }

        return updated;
    }

}

module.exports = TaskService;
