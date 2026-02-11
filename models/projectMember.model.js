const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        role: {
            type: String,
            enum: ["OWNER", "MANAGER", "MEMBER"],
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
            index: true,
        },

        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        invitedAt: {
            type: Date,
            default: Date.now,
        },

        acceptedAt: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);

// Prevent duplicate invites
projectMemberSchema.index(
    { projectId: 1, userId: 1 },
    { unique: true }
);

module.exports = mongoose.model("ProjectMember", projectMemberSchema);
