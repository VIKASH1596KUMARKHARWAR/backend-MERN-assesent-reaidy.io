const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository");

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        const token = this._generateToken(user);

        return {
            user: this._sanitizeUser(user),
            token,
        };
    }

    async login(email, password) {
        const user = await this.userRepository.getByEmailWithPassword(email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = this._generateToken(user);

        return {
            user: this._sanitizeUser(user),
            token,
        };
    }

    _generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not configured");
        }

        return jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
    }

    _sanitizeUser(user) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
        };
    }
}

module.exports = AuthService;
