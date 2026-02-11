const TaskAnalyticsRepository = require("../repositories/taskAnalytics.repository");
const ProjectMemberRepository = require("../repositories/projectMember.repository");

class TaskAnalyticsService {
    constructor() {
        this.taskAnalyticsRepository = new TaskAnalyticsRepository();
        this.projectMemberRepository = new ProjectMemberRepository();
    }

    async ensureMember(projectId, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member) {
            throw new Error("Not a project member");
        }
    }

    async getStatusAnalytics(projectId, userId) {
        await this.ensureMember(projectId, userId);
        return this.taskAnalyticsRepository.tasksByStatus(projectId);
    }

    async getUserAnalytics(projectId, userId) {
        await this.ensureMember(projectId, userId);
        return this.taskAnalyticsRepository.tasksByUser(projectId);
    }

    async getOverdueTasks(projectId, userId) {
        await this.ensureMember(projectId, userId);
        return this.taskAnalyticsRepository.overdueTasks(projectId);
    }

    async getAvgCompletionTime(projectId, userId) {
        await this.ensureMember(projectId, userId);
        const result =
            await this.taskAnalyticsRepository.avgCompletionTime(projectId);

        return result[0]?.avgDuration || 0;
    }
}

module.exports = TaskAnalyticsService;
