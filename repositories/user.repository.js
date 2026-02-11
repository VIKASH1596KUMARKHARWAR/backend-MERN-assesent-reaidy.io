const CrudRepository = require("./crud.repository");
const { User } = require("../models");

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getByEmailWithPassword(email) {
        return User.findOne({ email }).select("+password");
    }

    async getByEmail(email) {
        return User.findOne({ email }).select("-password");
    }


    async getAllUsers() {
        return User.find().select("-password");
    }
}

module.exports = UserRepository;
