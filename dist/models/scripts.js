"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScripts = exports.getScriptsRecommended = exports.updateScriptById = exports.deleteScript = exports.createScript = exports.getScriptByName = exports.getScriptById = exports.getScriptsByStaff = exports.Scripts = exports.ScriptSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ScriptSchema = new mongoose_1.default.Schema({
    nameScript: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    plan: {
        day: { type: Number, default: null },
        monthly: { type: Number, default: null },
        permanently: { type: Number, require: true, default: null }
    },
    thumbnail: { type: String, require: true },
    video: { type: String, default: null },
    image: [],
    Changelogs: [
        {
            version: { type: String, required: true },
            logs: [],
        },
    ],
    webhook: { type: String, required: true },
    recommended: { type: Boolean, required: true, default: false },
    download: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
});
exports.Scripts = mongoose_1.default.model("Scripts", exports.ScriptSchema);
const getScriptsByStaff = () => exports.Scripts.find();
exports.getScriptsByStaff = getScriptsByStaff;
const getScriptById = (scriptId) => exports.Scripts.findById(scriptId).then((script) => script?.toObject()).catch(() => null);
exports.getScriptById = getScriptById;
const getScriptByName = (nameScript) => exports.Scripts.findOne({ nameScript });
exports.getScriptByName = getScriptByName;
const createScript = (values) => new exports.Scripts(values).save().then((scripts) => scripts.toObject());
exports.createScript = createScript;
const deleteScript = (id) => exports.Scripts.findByIdAndDelete(id);
exports.deleteScript = deleteScript;
const updateScriptById = (scriptId, updates) => exports.Scripts.findByIdAndUpdate(scriptId, updates, { new: true }).then((script) => script?.toObject()).catch(() => null);
exports.updateScriptById = updateScriptById;
const getScriptsRecommended = () => exports.Scripts.find({ recommended: true, status: "active" });
exports.getScriptsRecommended = getScriptsRecommended;
const getScripts = () => exports.Scripts.find({ status: "active" });
exports.getScripts = getScripts;
//# sourceMappingURL=scripts.js.map