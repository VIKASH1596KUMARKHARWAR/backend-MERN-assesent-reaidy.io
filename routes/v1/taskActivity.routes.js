const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const controller = require("../../controllers/taskActivity.controller");

const router = express.Router();

router.post("/task", authenticate, controller.getTaskActivity);
router.post("/project", authenticate, controller.getProjectActivity);

module.exports = router;
