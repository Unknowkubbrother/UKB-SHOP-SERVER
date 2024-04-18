"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = exports.getpeymentBytransRefId = exports.Payments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentsSchema = new mongoose_1.default.Schema({
    transRefId: { type: String, required: true, unique: true },
    data: [
        {
            scriptId: { type: String, required: true },
            nameScript: { type: String, required: true },
            Plan: {
                permanently: {
                    status: { type: Boolean, required: true, default: false },
                    price: { type: Number, required: true, default: 0 },
                },
                rent: {
                    status: { type: Boolean, required: true, default: false },
                    Unitprice: { type: Number, required: true, default: 0 },
                    day: { type: Number, required: true, default: 0 },
                    price: { type: Number, required: true, default: 0 },
                },
            },
        },
    ],
    total: { type: Number, required: true },
    dateSlip: { type: String, required: true },
    username: { type: String, required: true }
}, { timestamps: true });
exports.Payments = mongoose_1.default.model("Payments", PaymentsSchema);
const getpeymentBytransRefId = (transRefId) => exports.Payments.findOne({ transRefId });
exports.getpeymentBytransRefId = getpeymentBytransRefId;
const createPayment = (values) => new exports.Payments(values)
    .save().then((payment) => payment.toObject());
exports.createPayment = createPayment;
//# sourceMappingURL=payments.js.map