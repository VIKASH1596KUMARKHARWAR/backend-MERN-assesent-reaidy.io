const ProjectMemberService = require("../services/projectMember.service");
const service = new ProjectMemberService();

const checkProjectAccess = async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await service.checkProjectAccess(projectId, userId);

    if (!member) {
        return res.status(403).json({
            success: false,
            message: "You do not have access to this project",
        });
    }

    req.projectRole = member.role;
    next();
};

module.exports = checkProjectAccess;
