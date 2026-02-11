const ProjectMemberRepository = require("../repositories/projectMember.repository");
const PERMISSIONS = require("../config/permissions");

const projectMemberRepository = new ProjectMemberRepository();

/**
 * RBAC Authorization Middleware
 * @param {string} projectKey - key name for projectId
 * @param {string} action - permission action (e.g. MEMBER_INVITE)
 * @param {"body" | "params"} source - where projectId comes from
 */
const authorize = (projectKey, action, source = "body") => {
    return async (req, res, next) => {
        try {
            const projectId =
                source === "body"
                    ? req.body[projectKey]
                    : req.params[projectKey];

            if (!projectId) {
                return res.status(400).json({
                    success: false,
                    message: "Project ID missing for authorization",
                });
            }

            // ✅ Only ACCEPTED members
            const membership =
                await projectMemberRepository.findAcceptedMember(
                    projectId,
                    req.user.id
                );

            if (!membership) {
                return res.status(403).json({
                    success: false,
                    message: "Not a project member",
                });
            }

            // ✅ Role → permissions
            const rolePermissions = PERMISSIONS[membership.role];

            if (!rolePermissions || !rolePermissions[action]) {
                return res.status(403).json({
                    success: false,
                    message: "Permission denied",
                });
            }

            // Optional: expose role to controllers
            req.projectRole = membership.role;

            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { authorize };
