const ProjectMemberService = require("../services/projectMember.service");
const projectMemberService = new ProjectMemberService();

const inviteMember = async (req, res, next) => {
    try {
        const { projectId, userId, role } = req.body;

        const member = await projectMemberService.inviteMember(
            { projectId, userId, role },
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: member,
        });
    } catch (err) {
        next(err);
    }
};

const acceptInvite = async (req, res, next) => {
    try {
        const member = await projectMemberService.acceptInvite(
            req.body.projectId,
            req.user.id
        );
        res.json({ success: true, data: member });
    } catch (err) {
        next(err);
    }
};

const getMembers = async (req, res, next) => {
    try {
        const { projectId } = req.body;

        const members = await projectMemberService.getMembers(
            projectId,
            req.user.id
        );

        res.json({
            success: true,
            data: members,
        });
    } catch (err) {
        next(err);
    }
};

// controllers/projectMember.controller.js
const updateMemberRole = async (req, res, next) => {
    try {
        const { projectId, memberId, role } = req.body;

        const data = await projectMemberService.updateRole(
            projectId,
            memberId,
            role,
            req.user.id
        );

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
const removeMember = async (req, res, next) => {
    try {
        const { projectId, memberId } = req.body;

        await projectMemberService.removeMember(
            projectId,
            memberId,
            req.user.id
        );

        res.json({ success: true, message: "Member removed" });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    inviteMember,
    acceptInvite,
    getMembers,
    updateMemberRole,
    removeMember
};
