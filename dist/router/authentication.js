"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.post('/auth/register', authentication_1.register);
    router.post('/auth/login', authentication_1.login);
    router.post('/auth/session', authentication_1.loginBySessionToken);
    router.post('/auth/logout', authentication_1.logout);
    router.get('/auth/user', middlewares_1.isAuthenticated, middlewares_1.isStaff, authentication_1.getAllUser);
    router.post('/auth/forgot-pass', authentication_1.forgotPassword);
    router.post('/auth/reset-pass', authentication_1.resetpassword);
};
//# sourceMappingURL=authentication.js.map