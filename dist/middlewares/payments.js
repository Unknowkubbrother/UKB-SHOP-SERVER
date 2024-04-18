"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySlip = exports.uploadSlip = void 0;
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const multer_1 = __importDefault(require("multer"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const payments_1 = require("../models/payments");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imagePayment-slip');
    },
    filename: async function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
};
exports.uploadSlip = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single('paymentSlip');
const verifySlip = async (req, res, next) => {
    try {
        let { storeData, total } = req.body;
        storeData = await JSON.parse(storeData);
        const cookies = JSON.parse(req.cookies['ukb-data']);
        const username = cookies.username;
        if (!storeData || !username || !req.file || !total) {
            return res.sendStatus(400);
        }
        const formData = new form_data_1.default();
        formData.append('file', fs_1.default.createReadStream(req.file.path));
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://developer.easyslip.com/api/v1/verify',
            headers: {
                'Authorization': 'Bearer a6cc2c81-7cb0-4b3c-a594-221f8e144228',
                ...formData.getHeaders()
            },
            data: formData
        };
        const response = await axios_1.default.request(config);
        if (response.data.status === 200) {
            const name = response.data.data.receiver.account.name.en.split(" ");
            if (name[0] === "NUTCHANON") {
                const tranRefCheck = await (0, payments_1.getpeymentBytransRefId)(response.data.data.transRef);
                if (tranRefCheck) {
                    return res.status(409).send("This slip has been verified").end();
                }
                if (parseFloat(response.data.data.amount.amount) !== parseFloat(total)) {
                    return res.status(400).send("Total amount is not equal to the slip amount").end();
                }
                req.body.transRefId = response.data.data.transRef;
                req.body.data = storeData;
                req.body.total = parseFloat(total);
                req.body.dateSlip = response.data.data.date;
                req.body.username = username;
                req.body.imageSlip = req.file.filename;
                next();
            }
            else {
                return res.status(400).send("This slip is not from the account holder").end();
            }
        }
    }
    catch (error) {
        console.log(error);
        if (error.response.status === 404) {
            return res.status(404).send(error.response.data.message).end();
        }
        return res.sendStatus(400);
    }
};
exports.verifySlip = verifySlip;
//# sourceMappingURL=payments.js.map