const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    assignTask,
    applyAiSuggestion,
} = require("../../controllers/task.controller");

const taskAiController = require("../../controllers/taskAi.controller");

const router = express.Router();

// Basic task routes
router.post("/", authenticate, createTask);
router.post("/list", authenticate, getTasks);
router.patch("/update", authenticate, updateTask);
router.patch("/assign", authenticate, assignTask);
router.delete("/delete", authenticate, deleteTask);

// AI routes
router.patch("/:taskId/ai/apply", authenticate, applyAiSuggestion);
router.post("/:taskId/ai/suggest", authenticate, taskAiController.suggest);

module.exports = router;

