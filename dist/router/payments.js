"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payments_1 = require("../controllers/payments");
const middlewares_1 = require("../middlewares");
const payments_2 = require("../middlewares/payments");
exports.default = (router) => {
    router.post('/payment/generator', middlewares_1.isAuthenticated, payments_1.generatorQr);
    router.post('/payment/checkout', middlewares_1.isAuthenticated, payments_2.uploadSlip, payments_2.verifySlip, payments_1.buyScript);
    router.get('/payment', middlewares_1.isAuthenticated, payments_1.getpeymentForUser);
};
//# sourceMappingURL=payments.js.map