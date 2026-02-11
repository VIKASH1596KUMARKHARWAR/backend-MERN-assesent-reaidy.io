const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const controller = require("../../controllers/taskAnalytics.controller");

const router = express.Router();

router.post("/status", authenticate, controller.tasksByStatus);
router.post("/users", authenticate, controller.tasksByUser);
router.post("/overdue", authenticate, controller.overdueTasks);
router.post("/avg-completion", authenticate, controller.avgCompletionTime);

module.exports = router;
