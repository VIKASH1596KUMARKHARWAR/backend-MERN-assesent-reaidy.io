const express = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/permission.middleware");
const {
  inviteMember,
  acceptInvite,
  getMembers,
  updateMemberRole,
  removeMember,
} = require("../../controllers/projectMember.controller");

const router = express.Router();

// Invite
router.post(
  "/invite",
  authenticate,
  authorize("projectId", "MEMBER_INVITE", "body"),
  inviteMember
);

// Accept invite
router.post(
  "/accept",
  authenticate,
  acceptInvite
);

// List members
router.post(
  "/list",
  authenticate,
  authorize("projectId", "PROJECT_UPDATE", "body"),
  getMembers
);


// routes/v1/projectMember.routes.js
router.patch(
  "/role",
  authenticate,
  authorize("projectId", "MEMBER_ROLE_UPDATE", "body"),
  updateMemberRole
);


router.delete(
  "/remove",
  authenticate,
  authorize("projectId", "MEMBER_REMOVE", "body"),
  removeMember
);


module.exports = router;
