const UserService = require("../services/user.service");
const userService = new UserService();

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    getAllUsers,
};
