"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scripts_1 = require("../controllers/scripts");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.post('/script', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.addScript);
    router.get('/script', scripts_1.getAllScripts);
    router.get('/script/:id', scripts_1.getScriptByid);
    router.delete('/script/:id', middlewares_1.isAuthenticated, middlewares_1.isStaff, scripts_1.delete_a_Script);
};
//# sourceMappingURL=scripts.js.map