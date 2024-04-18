"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScript = exports.createScript = exports.getScriptByName = exports.getScriptById = exports.getScripts = exports.Scripts = exports.ScriptSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ScriptSchema = new mongoose_1.default.Schema({
    nameScript: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    trade: {
        permanently: {
            status: { type: Boolean, required: true, default: false },
            price: { type: Number, required: true, default: 0 },
        },
        rent: {
            status: { type: Boolean, required: true, default: false },
            Unitprice: { type: Number, required: true, default: 0 }
        },
    },
    promote: {
        youTube: { type: String, required: true },
        image: [
            {
                url: { type: String, required: true },
                alt: { type: String, required: true },
            },
        ],
    },
    Changelogs: [
        {
            version: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
    webhook: { type: String, required: true },
    recommended: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: "active" },
});
exports.Scripts = mongoose_1.default.model("Scripts", exports.ScriptSchema);
const getScripts = () => exports.Scripts.find();
exports.getScripts = getScripts;
const getScriptById = (scriptId) => exports.Scripts.findById(scriptId).then((script) => script?.toObject()).catch(() => null);
exports.getScriptById = getScriptById;
const getScriptByName = (nameScript) => exports.Scripts.findOne({ nameScript });
exports.getScriptByName = getScriptByName;
const createScript = (values) => new exports.Scripts(values).save().then((scripts) => scripts.toObject());
exports.createScript = createScript;
const deleteScript = (nameScript) => exports.Scripts.findOneAndDelete({ nameScript });
exports.deleteScript = deleteScript;
//# sourceMappingURL=scripts.js.map