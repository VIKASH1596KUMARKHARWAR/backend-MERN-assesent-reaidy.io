const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/permission.middleware");
const {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject,
} = require("../../controllers/project.controller");

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/me", authenticate, getMyProjects);

router.patch(
    "/",
    authenticate,
    authorize("projectId", "PROJECT_UPDATE", "body"),
    updateProject
);

router.delete(
    "/",
    authenticate,
    authorize("projectId", "PROJECT_DELETE", "body"),
    deleteProject
);

module.exports = router;
