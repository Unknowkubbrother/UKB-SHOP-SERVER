"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const licenses_1 = require("../controllers/licenses");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/license', middlewares_1.isAuthenticated, middlewares_1.isStaff, licenses_1.getAllLicenses);
    router.post('/checkLicense', licenses_1.Checklicense);
    router.post('/license', middlewares_1.isAuthenticated, licenses_1.Addlicense);
    router.put('/license', middlewares_1.isAuthenticated, licenses_1.ResetLicense);
    router.delete('/license', middlewares_1.isAuthenticated, middlewares_1.isStaff, licenses_1.delete_a_license);
    router.post('/license/user', middlewares_1.isAuthenticated, licenses_1.getAllLicenseForUser);
    router.post('/license/activeControl', middlewares_1.isAuthenticated, licenses_1.ActiveControl);
    router.get('/license/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, licenses_1.getLicenseByScriptIdForstaff);
};
//# sourceMappingURL=license.js.map