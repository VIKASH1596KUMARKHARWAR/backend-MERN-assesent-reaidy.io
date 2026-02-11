// repositories/projectMember.repository.js
const CrudRepository = require("./crud.repository");
const { ProjectMember } = require("../models");

class ProjectMemberRepository extends CrudRepository {
    constructor() {
        super(ProjectMember);
    }

    /** Pending invite */
    async findPendingInvite(projectId, userId) {
        return ProjectMember.findOne({
            projectId,
            userId,
            status: "PENDING",
        });
    }

    /** Accepted member (auth checks) */
    async findAcceptedMember(projectId, userId) {
        return ProjectMember.findOne({
            projectId,
            userId,
            status: "ACCEPTED",
        });
    }

    /** Any invite or membership */
    async findAnyInvite(projectId, userId) {
        return ProjectMember.findOne({ projectId, userId });
    }

    /** ✅ ALL accepted memberships of a user */
    async findAcceptedMembershipsByUser(userId) {
        return ProjectMember.find({
            userId,
            status: "ACCEPTED",
        });
    }

    /** All accepted members of a project */
    async getProjectMembers(projectId) {
        return ProjectMember.find({
            projectId,
            status: "ACCEPTED",
        }).populate("userId", "name email");
    }



    findOne(filter) {
        return ProjectMember.findOne(filter);
    }

    findById(id) {
        return ProjectMember.findById(id);
    }// repositories/projectMember.repository.js

    async findByProject(projectId) {
        return this.model.find({
            projectId,
            status: "ACCEPTED",
        });
    }

}

module.exports = ProjectMemberRepository;
