"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBySessionToken = exports.createUser = exports.getUserByEmail = exports.getUserByUsername = exports.getUserById = exports.getUsers = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roles_1 = __importDefault(require("../enum/roles"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(roles_1.default), required: true, default: roles_1.default.USER },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
});
exports.User = mongoose_1.default.model('accounts', UserSchema);
const getUsers = () => exports.User.find();
exports.getUsers = getUsers;
const getUserById = (id) => exports.User.findById(id);
exports.getUserById = getUserById;
const getUserByUsername = (username) => exports.User.findOne({ username });
exports.getUserByUsername = getUserByUsername;
const getUserByEmail = (email) => exports.User.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const createUser = (values) => new exports.User(values)
    .save().then((user) => user.toObject());
exports.createUser = createUser;
const getUserBySessionToken = (sessionToken) => exports.User.findOne({
    'authentication.sessionToken': sessionToken
});
exports.getUserBySessionToken = getUserBySessionToken;
//# sourceMappingURL=users.js.map