const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            default: "TODO",
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },

        dueDate: {
            type: Date,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        generatedByAI: {
            type: Boolean,
            default: false,
        },

        aiSource: {
            type: String,
            enum: ["PRIORITY", "ASSIGNMENT", "DEADLINE", "FULL_TASK"],
            required: function () {
                return this.generatedByAI === true;
            },
        },

        estimatedEffort: {
            type: Number,
            min: 0,
        }, aiSuggestion: {
            priority: {
                type: String,
                enum: ["LOW", "MEDIUM", "HIGH"],
            },

            assignedTo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            dueDate: {
                type: Date,
            },

            reasoning: {
                priority: String,
                assignee: String,
                deadline: String,
            },
        },

        aiSuggestedAt: {
            type: Date,
        },

        aiAppliedAt: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

// Indexes for the faster queries in dashboard
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
