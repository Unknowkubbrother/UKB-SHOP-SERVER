"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const licenses_1 = require("../controllers/licenses");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/license', middlewares_1.isAuthenticated, middlewares_1.isStaff, licenses_1.getAllLicenses);
    router.post('/checkLicense', licenses_1.Checklicense);
    router.post('/license', middlewares_1.isAuthenticated, licenses_1.addLicense);
    router.put('/license', middlewares_1.isAuthenticated, licenses_1.ResetLicense);
    router.delete('/license', middlewares_1.isAuthenticated, middlewares_1.isStaff, licenses_1.delete_a_license);
    router.get('/license/user', middlewares_1.isAuthenticated, licenses_1.getAllLicenseForUser);
};
//# sourceMappingURL=license.js.map