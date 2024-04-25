"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicenseByScriptId = exports.deleteLicenseByusername = exports.createLicense = exports.getLicenseById = exports.getLicenseByUsername = exports.checkLicense = exports.getLicenseByNameScriptAndUsername = exports.getLicenseByLicenseAndUsername = exports.getLicense = exports.getLicenses = exports.Licenses = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LicenseSchema = new mongoose_1.default.Schema({
    license: { type: String, required: true, default: 'ยังไม่ได้เชื่อมต่อ License' },
    nameScript: { type: String, required: true },
    scriptId: { type: String, required: true },
    ipaddress: { type: String, required: true, default: 'ยังไม่ได้เชื่อมต่อ IP' },
    status: { type: String, required: true, default: 'inactive' },
    resetlicenseTime: { type: Number, required: true, default: 0 },
    rent: {
        status: { type: Boolean, required: true, default: false },
        startDate: { type: Number, required: true, default: 0 },
        endDate: { type: Number, required: true, default: 0 },
    },
    owner: { type: String, required: true }
});
exports.Licenses = mongoose_1.default.model('Licenses', LicenseSchema);
const getLicenses = () => exports.Licenses.find();
exports.getLicenses = getLicenses;
const getLicense = (license) => exports.Licenses.findOne({ license });
exports.getLicense = getLicense;
const getLicenseByLicenseAndUsername = (license, username) => exports.Licenses.findOne({ license, owner: username });
exports.getLicenseByLicenseAndUsername = getLicenseByLicenseAndUsername;
const getLicenseByNameScriptAndUsername = (nameScript, username) => exports.Licenses.findOne({ nameScript, owner: username });
exports.getLicenseByNameScriptAndUsername = getLicenseByNameScriptAndUsername;
const checkLicense = (license, ipaddress) => exports.Licenses.findOne({
    "license": license,
    "ipaddress": ipaddress
});
exports.checkLicense = checkLicense;
const getLicenseByUsername = (username) => exports.Licenses.find({ owner: username });
exports.getLicenseByUsername = getLicenseByUsername;
const getLicenseById = (id) => exports.Licenses.findById(id);
exports.getLicenseById = getLicenseById;
const createLicense = (values) => new exports.Licenses(values)
    .save().then((license) => license.toObject());
exports.createLicense = createLicense;
const deleteLicenseByusername = (license, username) => exports.Licenses.findOneAndDelete({ license, owner: username });
exports.deleteLicenseByusername = deleteLicenseByusername;
const getLicenseByScriptId = (scriptId) => exports.Licenses.find({ scriptId });
exports.getLicenseByScriptId = getLicenseByScriptId;
//# sourceMappingURL=licenses.js.map