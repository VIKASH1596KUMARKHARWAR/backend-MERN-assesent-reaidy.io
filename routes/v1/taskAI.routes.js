const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const controller = require("../../controllers/taskAi.controller");


const router = express.Router();

 // router.post("/:taskId/ai/suggest", authenticate, controller.suggest);

module.exports = router;
