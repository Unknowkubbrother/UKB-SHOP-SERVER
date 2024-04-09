"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserResponse = exports.authentication = exports.generateLicense = exports.random = void 0;
require('dotenv').config();
const crypto_1 = __importDefault(require("crypto"));
const random = () => crypto_1.default.randomBytes(128).toString('base64');
exports.random = random;
const generateLicense = (nameScript, ipaddress) => {
    return crypto_1.default.createHmac('sha256', [ipaddress, nameScript].join('/')).update(ipaddress).digest('hex');
};
exports.generateLicense = generateLicense;
const authentication = (salt, password) => {
    return crypto_1.default.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET_KEY).digest('hex');
};
exports.authentication = authentication;
const getUserResponse = (user) => {
    let responseUser = {
        _id: user._id,
        username: user.username,
        email: user.email
    };
    // I use role to check if user is staff or not
    // the way that more secure is using another frontend of dashboard
    // Or make a website is server side rendering by hex <3
    if (user.role && user.role === 'staff') {
        responseUser.role = 'staff';
    }
    return responseUser;
};
exports.getUserResponse = getUserResponse;
//# sourceMappingURL=index.js.map