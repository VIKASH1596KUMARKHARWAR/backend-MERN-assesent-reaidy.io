const TaskActivityRepository = require("../repositories/taskActivity.repository");
const ProjectMemberRepository = require("../repositories/projectMember.repository");

class TaskActivityService {
  constructor() {
    this.taskActivityRepository = new TaskActivityRepository();
    this.projectMemberRepository = new ProjectMemberRepository();
  }

  async ensureMember(projectId, userId) {
    const member = await this.projectMemberRepository.findAcceptedMember(
      projectId,
      userId,
    );

    if (!member) {
      throw new Error("Not a project member");
    }
  }

  async getTaskActivity(taskId, projectId, userId) {
    await this.ensureMember(projectId, userId);
    return this.taskActivityRepository.getByTask(taskId);
  }

  async getProjectActivity(projectId, userId) {
    await this.ensureMember(projectId, userId);
    return this.taskActivityRepository.getByProject(projectId);
  }
}

module.exports = TaskActivityService;
