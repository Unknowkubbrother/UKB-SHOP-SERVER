"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scripts_1 = require("../controllers/scripts");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.post('/script_admin', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.addScriptbyStaff);
    router.get('/store', scripts_1.getScriptsStore);
    router.get('/script_admin', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.getAllScriptsByStaff);
    router.get('/script', scripts_1.getScriptsHome);
    router.get('/script/:id', scripts_1.getScriptByid);
    router.get('/script_admin/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.getScriptByidForStaff);
    router.delete('/script_admin/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.deleteScriptByStaff);
    router.put('/script_admin/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.UpdateScriptByStaff);
    router.put('/script_admin_version/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.UpdateVersionByStaff);
};
//# sourceMappingURL=scripts.js.map