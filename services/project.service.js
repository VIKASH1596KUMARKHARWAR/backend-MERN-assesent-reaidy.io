const ProjectRepository = require("../repositories/project.repository");
const ProjectMemberRepository = require("../repositories/projectMember.repository");

class ProjectService {
    constructor() {
        this.projectRepository = new ProjectRepository();
        this.projectMemberRepository = new ProjectMemberRepository();
    }

    /**
     * CREATE PROJECT
     * Creator becomes OWNER
     */
    async createProject(data, userId) {
        const project = await this.projectRepository.create({
            name: data.name,
            description: data.description,
            createdBy: userId,
        });

        await this.projectMemberRepository.create({
            projectId: project._id,
            userId,
            role: "OWNER",
            status: "ACCEPTED",
            invitedBy: userId,
            acceptedAt: new Date(),
        });

        return project;
    }

    /**
     * Get projects where user is ACCEPTED member
     */
    async getMyProjects(userId) {
        // 1️⃣ Get accepted memberships
        const memberships =
            await this.projectMemberRepository.findAcceptedMembershipsByUser(userId);

        if (!memberships.length) return [];

        // 2️⃣ Extract project IDs
        const projectIds = memberships.map(m => m.projectId);

        // 3️⃣ Fetch projects
        return this.projectRepository.getByIds(projectIds);
    }


    /**
     * Update project
     * Only OWNER / MANAGER
     */
    async updateProject(projectId, data, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member || !["OWNER", "MANAGER"].includes(member.role)) {
            throw new Error("Not authorized to update project");
        }

        return this.projectRepository.update(projectId, data);
    }

    /**
     * Delete project
     * Only OWNER
     */
    async deleteProject(projectId, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member || member.role !== "OWNER") {
            throw new Error("Only owner can delete project");
        }

        await this.projectMemberRepository.deleteMany({ projectId });
        return this.projectRepository.delete(projectId);
    }


}

module.exports = ProjectService;
