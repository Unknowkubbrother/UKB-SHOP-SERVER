"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIP = exports.isAuthenticated = exports.isOwner = exports.isStaff = void 0;
require('dotenv').config();
const roles_1 = __importDefault(require("../enum/roles"));
const lodash_1 = require("lodash");
const users_1 = require("../models/users");
const isStaff = async (req, res, next) => {
    try {
        const currentUserId = (0, lodash_1.get)(req, 'identity._id');
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        const currentUser = await (0, users_1.getUserById)(currentUserId);
        if (!currentUser) {
            return res.sendStatus(403);
        }
        if (currentUser.role !== roles_1.default.STAFF) {
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isStaff = isStaff;
const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = (0, lodash_1.get)(req, 'identity._id');
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isOwner = isOwner;
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        console.log(`${existingUser.username} isAuthenticated middleware!`);
        req.body.username = existingUser.username;
        (0, lodash_1.merge)(req, { identity: existingUser });
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.isAuthenticated = isAuthenticated;
const getIP = async (req, res, next) => {
    try {
        var ip = (function (req) {
            var ipaddr = require('ipaddr.js');
            var ipString = (req.headers["X-Forwarded-For"] ||
                req.headers["x-forwarded-for"] ||
                '').split(',')[0] ||
                req.socket.remoteAddress;
            // req.connection.remoteAddress;
            if (ipaddr.isValid(ipString)) {
                try {
                    var addr = ipaddr.parse(ipString);
                    if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
                        return addr.toIPv4Address().toString();
                    }
                    return addr.toNormalizedString();
                }
                catch (e) {
                    return ipString;
                }
            }
            return 'unknown';
        }(req));
        req.body.ipaddress = ip;
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getIP = getIP;
//# sourceMappingURL=index.js.map