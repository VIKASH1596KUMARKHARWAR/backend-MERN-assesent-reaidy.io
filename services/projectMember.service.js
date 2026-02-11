const ProjectMemberRepository = require("../repositories/projectMember.repository");

class ProjectMemberService {
    constructor() {
        this.projectMemberRepository = new ProjectMemberRepository();
    }

    // Invite user
    async inviteMember({ projectId, userId, role }, invitedBy) {
        const inviter =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                invitedBy
            );

        if (!inviter) {
            throw new Error("Not a project member");
        }

        if (!["OWNER", "MANAGER"].includes(inviter.role)) {
            throw new Error("Not authorized to invite members");
        }

        const existing =
            await this.projectMemberRepository.findAnyInvite(
                projectId,
                userId
            );

        if (existing) {
            throw new Error("User already invited or member");
        }

        return this.projectMemberRepository.create({
            projectId,
            userId,
            role,
            invitedBy,
            status: "PENDING",
            invitedAt: new Date(),
        });
    }

    // Accept invite
    async acceptInvite(projectId, userId) {
        const invite =
            await this.projectMemberRepository.findPendingInvite(
                projectId,
                userId
            );

        if (!invite) {
            throw new Error("No pending invitation found");
        }

        invite.status = "ACCEPTED";
        invite.acceptedAt = new Date();
        return invite.save();
    }

    // List members
    async getMembers(projectId, userId) {
        const member =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                userId
            );

        if (!member) {
            throw new Error("Not a project member");
        }

        return this.projectMemberRepository.getProjectMembers(projectId);
    }

    // ✅ UPDATE ROLE (FIXED)
    async updateRole(projectId, memberId, newRole, requesterId) {
        const requester =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                requesterId
            );

        if (!requester || requester.role !== "OWNER") {
            throw new Error("Only owner can update roles");
        }

        // 🔥 FIX: scope by _id + projectId
        const member =
            await this.projectMemberRepository.findOne({
                _id: memberId,
                projectId,
                status: "ACCEPTED",
            });

        if (!member) {
            throw new Error("Invalid member");
        }

        // Prevent owner demoting self
        if (member.userId.equals(requesterId)) {
            throw new Error("Owner cannot change own role");
        }

        member.role = newRole;
        return member.save();
    }

    // Remove member (soft delete)
    async removeMember(projectId, memberId, requesterId) {
        const requester =
            await this.projectMemberRepository.findAcceptedMember(
                projectId,
                requesterId
            );

        if (!requester) {
            throw new Error("Not authorized");
        }

        const member =
            await this.projectMemberRepository.findOne({
                _id: memberId,
                projectId,
                status: "ACCEPTED",
            });

        if (!member) {
            throw new Error("Member not found");
        }

        if (
            requester.role === "MANAGER" &&
            member.role !== "MEMBER"
        ) {
            throw new Error("Manager can remove only members");
        }

        if (requester.role === "MEMBER") {
            throw new Error("Not authorized");
        }

        member.status = "REMOVED";
        member.removedAt = new Date();
        return member.save();
    }
}

module.exports = ProjectMemberService;
