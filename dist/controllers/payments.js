"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyScript = exports.generatorQr = void 0;
require("dotenv").config();
const promptpay_qr_1 = __importDefault(require("promptpay-qr"));
const qrcode_1 = __importDefault(require("qrcode"));
const payments_1 = require("../models/payments");
const licenses_1 = require("../models/licenses");
const generatorQr = async (req, res) => {
    try {
        const { mobileNumber, amount } = req.body;
        if (!mobileNumber || !amount || amount <= 0 || !(mobileNumber.length == 10)) {
            return res.sendStatus(400);
        }
        const generQRCode = (payload) => {
            const options = { type: 'svg', color: { dark: '#000', light: '#fff' } };
            let QrcodeSvg = "";
            qrcode_1.default.toString(payload, options, (err, svg) => {
                if (err)
                    return console.log(err);
                QrcodeSvg = svg;
            });
            return QrcodeSvg;
        };
        const payload = await (0, promptpay_qr_1.default)(mobileNumber, { amount });
        const svg = await generQRCode(payload);
        return res.status(200).send(svg);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.generatorQr = generatorQr;
const buyScript = async (req, res) => {
    try {
        const { transRefId, data, total, dateSlip, imageSlip, username } = req.body;
        if (!transRefId || !data || !total || !dateSlip || !imageSlip || !username) {
            return res.sendStatus(400);
        }
        const slip = await (0, payments_1.createPayment)({
            transRefId,
            data,
            total,
            dateSlip,
            imageSlip,
            username
        });
        if (!slip) {
            return res.sendStatus(400);
        }
        if (process.env.TimeZoneTH == "true") {
            await data.forEach(async (license) => {
                const { nameScript, scriptId, Plan } = license;
                if (!nameScript || !scriptId || !Plan || !username) {
                    return res.sendStatus(400);
                }
                await (0, licenses_1.createLicense)({
                    nameScript: nameScript,
                    scriptId: scriptId,
                    rent: {
                        status: (Plan.rent.status) ? true : false,
                        startDate: (Plan.rent.status) ? Date.now() + (7 * 60 * 60 * 1000) : 0,
                        endDate: (Plan.rent.status) ? Date.now() + (Plan.rent.day * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000) : 0
                    },
                    owner: username
                });
            });
        }
        else {
            await data.forEach(async (license) => {
                const { nameScript, scriptId, Plan } = license;
                if (!nameScript || !scriptId || !Plan || !username) {
                    return res.sendStatus(400);
                }
                await (0, licenses_1.createLicense)({
                    nameScript: nameScript,
                    scriptId: scriptId,
                    rent: {
                        status: (Plan.rent.status) ? true : false,
                        startDate: (Plan.rent.status) ? Date.now() : 0,
                        endDate: (Plan.rent.status) ? Date.now() + (Plan.rent.day * 24 * 60 * 60 * 1000) : 0
                    },
                    owner: username
                });
            });
        }
        return res.status(201).json(slip).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.buyScript = buyScript;
//# sourceMappingURL=payments.js.map