"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScript = exports.createScript = exports.getScript = exports.getScripts = exports.Scripts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ScriptSchema = new mongoose_1.default.Schema({
    nameScript: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    webhook: { type: String, required: true },
    status: { type: String, required: true, default: 'active' },
});
exports.Scripts = mongoose_1.default.model('Scripts', ScriptSchema);
const getScripts = () => exports.Scripts.find();
exports.getScripts = getScripts;
const getScript = (nameScript) => exports.Scripts.findOne({ nameScript });
exports.getScript = getScript;
const createScript = (values) => new exports.Scripts(values)
    .save().then((scripts) => scripts.toObject());
exports.createScript = createScript;
const deleteScript = (nameScript) => exports.Scripts.findOneAndDelete({ nameScript });
exports.deleteScript = deleteScript;
//# sourceMappingURL=scripts.js.map