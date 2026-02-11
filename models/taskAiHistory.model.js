const mongoose = require("mongoose");

const taskAiHistorySchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    suggestion: Object,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaskAiHistory", taskAiHistorySchema);
