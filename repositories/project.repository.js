// const CrudRepository = require("./crud.repository");
// const { Project, ProjectMember } = require("../models");

// class ProjectRepository extends CrudRepository {
//     constructor() {
//         super(Project);
//     }

//     /** Projects created by user (OWNER) */
//     async getByCreator(userId) {
//         return Project.find({ createdBy: userId });
//     }



//     /** Projects where user is an accepted member */
//     async getByMember(userId) {
//         return Project.aggregate([
//             {
//                 $lookup: {
//                     from: "projectmembers",
//                     localField: "_id",
//                     foreignField: "projectId",
//                     as: "members",
//                 },
//             },
//             {
//                 $match: {
//                     "members.userId": userId,
//                     "members.status": "ACCEPTED",
//                 },
//             },
//             {
//                 $project: {
//                     members: 0,
//                 },
//             },
//         ]);
//     }

//     async getById(projectId) {
//         return Project.findById(projectId);
//     }
// }

// module.exports = ProjectRepository;
// repositories/project.repository.js
const CrudRepository = require("./crud.repository");
const { Project } = require("../models");

class ProjectRepository extends CrudRepository {
    constructor() {
        super(Project);
    }

    async getByIds(projectIds) {
        return Project.find({ _id: { $in: projectIds } });
    }

    async getById(projectId) {
        return Project.findById(projectId);
    }
}

module.exports = ProjectRepository;
