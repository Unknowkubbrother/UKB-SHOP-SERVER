"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = exports.getPaymentsbyUser = exports.createPayment = exports.getpeymentBytransRefId = exports.Payments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentsSchema = new mongoose_1.default.Schema({
    transRefId: { type: String, required: true, unique: true },
    data: [
        {
            scriptId: { type: String, required: true },
            nameScript: { type: String, required: true },
            plan: {
                permanently: { type: Number, default: null },
                monthly: { type: Number, default: null },
                day: { type: Number, default: null },
                UnitPrice: { type: Number, default: null },
                unit: { type: Number, default: null },
            }
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
const getPaymentsbyUser = (username) => exports.Payments.find({ username });
exports.getPaymentsbyUser = getPaymentsbyUser;
const getPayments = () => exports.Payments.find();
exports.getPayments = getPayments;
//# sourceMappingURL=payments.js.map