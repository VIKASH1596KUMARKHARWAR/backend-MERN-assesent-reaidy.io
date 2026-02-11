const ProjectService = require("../services/project.service");
const projectService = new ProjectService();

/**
 * Create project
 * Any authenticated user
 */
const createProject = async (req, res, next) => {
    try {
        const project = await projectService.createProject(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get projects where user is ACCEPTED member
 */
const getMyProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getMyProjects(req.user.id);

        res.json({
            success: true,
            data: projects,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update project
 * projectId from body
 * Only OWNER / MANAGER
 */
const updateProject = async (req, res, next) => {
    try {
        const { projectId, ...updateData } = req.body;

        const project = await projectService.updateProject(
            projectId,
            updateData,
            req.user.id
        );

        res.json({
            success: true,
            data: project,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Delete project
 * projectId from body
 * Only OWNER
 */
const deleteProject = async (req, res, next) => {
    try {
        const { projectId } = req.body;

        await projectService.deleteProject(
            projectId,
            req.user.id
        );

        res.json({
            success: true,
            message: "Project deleted",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject,
};
