const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const projectRoutes = require("./project.routes");
const taskRoutes = require("./task.routes");
const notificationRoutes = require("./notification.routes");
const projectMemberRoutes = require("./projectMember.routes");
const taskAnalyticsRoutes = require("./taskAnalytics.routes");
const taskActivityRoutes = require("./taskActivity.routes");
// const taskAIRoutes = require("./taskAI.routes");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
// Tasks
router.use("/tasks", taskRoutes);
// router.use("/tasks", taskAIRoutes);
router.use("/notifications", notificationRoutes);
router.use("/project-members", projectMemberRoutes);
router.use("/tasks/analytics", taskAnalyticsRoutes);
router.use("/task-activity", taskActivityRoutes);

module.exports = router;
