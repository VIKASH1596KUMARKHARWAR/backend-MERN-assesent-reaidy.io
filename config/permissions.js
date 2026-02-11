module.exports = {
    OWNER: {
        PROJECT_UPDATE: true,
        PROJECT_DELETE: true,
        PROJECT_STATUS_UPDATE: true,

        MEMBER_INVITE: true,
        MEMBER_REMOVE: true,
        MEMBER_ROLE_UPDATE: true,

        TASK_CREATE: true,
        TASK_UPDATE: true,
        TASK_DELETE: true,
        TASK_ASSIGN: true,
    },

    MANAGER: {
        PROJECT_UPDATE: true,
        PROJECT_STATUS_UPDATE: true,

        MEMBER_INVITE: true,
        MEMBER_REMOVE: true,

        TASK_CREATE: true,
        TASK_UPDATE: true,
        TASK_DELETE: true,
        TASK_ASSIGN: true,
    },

    MEMBER: {
        TASK_CREATE: true,
        TASK_UPDATE: true,
        TASK_DELETE: false,
        TASK_ASSIGN: false,
    },
};
