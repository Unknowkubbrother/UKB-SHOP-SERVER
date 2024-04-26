"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = exports.forgotPassword = exports.getAllUser = exports.logout = exports.loginBySessionToken = exports.login = exports.register = void 0;
require('dotenv').config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const users_1 = require("../models/users");
const helpers_1 = require("../helpers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.sendStatus(400);
        }
        if (password !== confirmPassword) {
            return res.sendStatus(400);
        }
        const existingUser = await (0, users_1.getUserByUsername)(username);
        if (existingUser) {
            return res.sendStatus(409);
        }
        const existingEmail = await (0, users_1.getUserByEmail)(email);
        if (existingEmail) {
            return res.sendStatus(409);
        }
        const salt = (0, helpers_1.random)();
        const user = await (0, users_1.createUser)({
            username,
            email,
            authentication: {
                password: (0, helpers_1.authentication)(salt, password),
                salt,
            }
        });
        const responseUser = (0, helpers_1.getUserResponse)(user);
        return res.status(201).json(responseUser).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.sendStatus(401);
        }
        const user = await (0, users_1.getUserByUsername)(username).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.sendStatus(401);
        }
        const expectedHash = (0, helpers_1.authentication)(user.authentication.salt, password);
        if (expectedHash !== user.authentication.password) {
            return res.sendStatus(401);
        }
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(401);
        }
        const salt = (0, helpers_1.random)();
        user.authentication.sessionToken = (0, helpers_1.authentication)(salt, user._id.toString());
        await user.save();
        if (!user.authentication.sessionToken) {
            return res.sendStatus(401);
        }
        res.cookie(process.env.COOKIE_NAME || 'ukb-auth', user.authentication.sessionToken, {
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: process.env.domainAPI
        });
        res.cookie('ukb-data', JSON.stringify({
            username: user.username,
            email: user.email,
            _id: user._id,
            role: user.role
        }), {
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: process.env.domainAPI
        });
        res.cookie('logged_in', 'true', {
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: process.env.domainAPI
        });
        console.log('setted cookie', user.authentication.sessionToken);
        const responseUser = (0, helpers_1.getUserResponse)(user);
        return res.status(200).json(responseUser).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.login = login;
const loginBySessionToken = async (req, res, next) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        console.log('loginBySessionToken: ', sessionToken);
        if (!sessionToken) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            return res.sendStatus(400);
        }
        const responseUser = (0, helpers_1.getUserResponse)(user);
        return res.status(200).json(responseUser).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.loginBySessionToken = loginBySessionToken;
const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        console.log('sessionToken: ', sessionToken);
        // const {sessionToken} = req.body;
        if (!sessionToken) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            return res.sendStatus(400);
        }
        user.authentication.sessionToken = '';
        await user.save();
        // clear cookies
        res.clearCookie(process.env.COOKIE_NAME || 'ukb-auth', { path: '/', domain: process.env.domainAPI });
        res.clearCookie('logged_in', { path: '/', domain: process.env.domainAPI });
        res.clearCookie('ukb-data', { path: '/', domain: process.env.domainAPI });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.logout = logout;
const getAllUser = async (req, res) => {
    try {
        const users = await (0, users_1.getUsers)();
        return res.status(200).json(users).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllUser = getAllUser;
const JWT_SECRET = 'Ux4yZZfNRT0FDpSOeQFg4+LtJOYMV/p+DaD+gk2VqcfLJwclteSsjHrsojw/lVQB29ajZDoiAeTd8XiwmErKIU1nARF4JUcmXvqWrTp26+wWqRkFeLigX6nmUMBUNjj/HxazfCyzshqoX9wszv';
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserByEmail)(email).select('+authentication.password');
        if (!user) {
            return res.sendStatus(404);
        }
        const Secretcode = JWT_SECRET + user.authentication.password;
        const token = jsonwebtoken_1.default.sign({ email: user.email }, Secretcode, {
            expiresIn: "5m",
        });
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS
            }
        });
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset For UKB-SHOP',
            text: `Secretcode : ${token}`
        }).then(() => {
            return res.sendStatus(200);
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(400);
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.forgotPassword = forgotPassword;
const resetpassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserByEmail)(email).select('+authentication.password');
        ;
        if (!user) {
            return res.sendStatus(404);
        }
        const Secretcode = JWT_SECRET + user.authentication.password;
        jsonwebtoken_1.default.verify(token, Secretcode, async (err, decoded) => {
            if (err) {
                return res.status(400).send('Invalid Token').end();
            }
            const salt = (0, helpers_1.random)();
            user.authentication.password = (0, helpers_1.authentication)(salt, newPassword);
            user.authentication.salt = salt;
            await user.save();
            return res.sendStatus(200);
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.resetpassword = resetpassword;
//# sourceMappingURL=authentication.js.map