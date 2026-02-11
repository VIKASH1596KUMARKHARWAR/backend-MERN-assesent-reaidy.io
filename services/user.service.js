const UserRepository = require("../repositories/user.repository");

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getProfile(userId) {
        return this.userRepository.getById(userId);
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }
}

module.exports = UserService;
