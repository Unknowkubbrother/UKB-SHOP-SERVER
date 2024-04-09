"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLicense = exports.createLicense = exports.getLicenseByUsername = exports.checkLicense = exports.getLicenseByNameScriptAndUsername = exports.getLicenseByLicenseAndUsername = exports.getLicense = exports.getLicenses = exports.Licenses = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LicenseSchema = new mongoose_1.default.Schema({
    nameScript: { type: String, required: true },
    license: { type: String, required: true, unique: true },
    ipaddress: { type: String, required: true },
    status: { type: String, required: true, default: 'active' },
    resetlicenseTime: { type: Number, required: true, default: 0 },
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
const createLicense = (values) => new exports.Licenses(values)
    .save().then((license) => license.toObject());
exports.createLicense = createLicense;
const deleteLicense = (license) => exports.Licenses.findOneAndDelete({ license });
exports.deleteLicense = deleteLicense;
//# sourceMappingURL=licenses.js.map