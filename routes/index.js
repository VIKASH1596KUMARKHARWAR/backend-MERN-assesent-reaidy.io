const express = require("express");

const authRoutes = require("./v1/auth.routes");
const taskRoutes = require("./v1/task.routes");
const notificationRoutes = require("./v1/notification.routes");
const projectRoutes = require("./v1/project.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/notifications", notificationRoutes);
router.use("/projects", projectRoutes);

module.exports = router;

