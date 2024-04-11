"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveControl = exports.getAllLicenseForUser = exports.ResetLicense = exports.Checklicense = exports.delete_a_license = exports.getAllLicenses = exports.BuyLicense = void 0;
require("dotenv").config();
const licenses_1 = require("../models/licenses");
const scripts_1 = require("../models/scripts");
const helpers_1 = require("../helpers");
const webhook_1 = require("../webhook");
const BuyLicense = async (req, res) => {
    try {
        const { nameScript, ipaddress, username, rent } = req.body;
        const license = `license-${nameScript}-${(0, helpers_1.generateLicense)(nameScript, ipaddress)}`;
        if (!license || !nameScript || !ipaddress || !username) {
            return res.sendStatus(400);
        }
        const License = await (0, licenses_1.getLicense)(license);
        if (License) {
            return res.sendStatus(409);
        }
        const CheckAlreayLicense = await (0, licenses_1.getLicenseByNameScriptAndUsername)(nameScript, username);
        if (CheckAlreayLicense) {
            return res.sendStatus(409);
        }
        if (rent.status) {
            const startDate = new Date(rent.startDate);
            const endDate = new Date(rent.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const startTime = startDate.getTime();
            const endTime = endDate.getTime();
            var newLicense = await (0, licenses_1.createLicense)({
                license,
                nameScript,
                ipaddress,
                owner: username,
                rent: {
                    status: rent.status,
                    startDate: startTime,
                    endDate: endTime,
                },
            });
        }
        else {
            var newLicense = await (0, licenses_1.createLicense)({
                license,
                nameScript,
                ipaddress,
                owner: username,
                rent: {
                    status: rent.status,
                    startDate: 0,
                    endDate: 0,
                },
            });
        }
        return res.status(201).send(newLicense.license).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.BuyLicense = BuyLicense;
const getAllLicenses = async (req, res) => {
    try {
        const licenses = await (0, licenses_1.getLicenses)();
        return res.json(licenses).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllLicenses = getAllLicenses;
const delete_a_license = async (req, res) => {
    try {
        const { license, username } = req.body;
        if (!license || !username) {
            return res.sendStatus(400);
        }
        const License = await (0, licenses_1.deleteLicense)(license);
        if (!License) {
            return res.sendStatus(404);
        }
        return res.send("License deleted successfully!").status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.delete_a_license = delete_a_license;
const Checklicense = async (req, res) => {
    try {
        const { license, ipaddress } = req.body;
        console.log(license, ipaddress);
        if (!license || !ipaddress) {
            return res.sendStatus(400);
        }
        const License = await (0, licenses_1.checkLicense)(license, ipaddress);
        if (!License) {
            return res.sendStatus(404);
        }
        if (License.status === "inactive") {
            return res.send("License is inactive").status(200).end();
        }
        const Script = await (0, scripts_1.getScript)(License.nameScript);
        if (!Script) {
            return res.sendStatus(404);
        }
        if (Script.status === "inactive") {
            return res.send("Script is inactive").status(200).end();
        }
        if (License.rent.status) {
            const startDate = License.rent.startDate;
            const endDate = License.rent.endDate;
            const now = Date.now();
            if (now < startDate || now > endDate) {
                const rentLicense = await (0, licenses_1.deleteLicense)(license);
                if (!rentLicense) {
                    return res.sendStatus(404);
                }
                else {
                    return res.send("License is expired").status(200).end();
                }
            }
        }
        await (0, webhook_1.Discordwebhook)(License.nameScript, ipaddress, License.owner, Script.webhook);
        return res.send(License.nameScript).status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.Checklicense = Checklicense;
const ResetLicense = async (req, res) => {
    try {
        const { license, username, Newipaddress } = req.body;
        if (!license || !username || !Newipaddress) {
            return res.sendStatus(400);
        }
        const licenseSplit = license.split("-");
        const License = await (0, licenses_1.getLicenseByLicenseAndUsername)(license, username);
        if (!License) {
            return res.sendStatus(404);
        }
        const getDate = (NextTime) => {
            let today = new Date(NextTime);
            let date = today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
            let time = today.getHours() + ":" + today.getMinutes();
            return date + " " + time;
        };
        if (License.resetlicenseTime > Date.now() &&
            License.resetlicenseTime !== 0) {
            return res
                .status(400)
                .send(`You can reset your license after ${getDate(License.resetlicenseTime)}`);
        }
        const day = parseInt(process.env.RESET_LICENSE_TIME);
        const DateNextReset = Date.now() + day * 24 * 60 * 60 * 1000;
        License.resetlicenseTime = DateNextReset;
        const Newlicense = `license-${licenseSplit[1]}-${(0, helpers_1.generateLicense)(licenseSplit[1], Newipaddress)}`;
        License.license = Newlicense;
        License.ipaddress = Newipaddress;
        License.save();
        return res
            .send({
            Newlicense: Newlicense,
            Newipaddress: Newipaddress,
            NextReset: getDate(DateNextReset),
        })
            .status(200)
            .end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.ResetLicense = ResetLicense;
const getAllLicenseForUser = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.sendStatus(400);
        }
        const Licenses = await (0, licenses_1.getLicenseByUsername)(username);
        if (!Licenses) {
            return res.sendStatus(404);
        }
        const LicensesArray = Licenses.map((license) => {
            return {
                license: license.license,
                nameScript: license.nameScript,
                ipaddress: license.ipaddress,
                owner: license.owner,
                status: license.status,
                show: false,
            };
        });
        return res.json(LicensesArray).status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllLicenseForUser = getAllLicenseForUser;
const ActiveControl = async (req, res) => {
    try {
        const { license, username } = req.body;
        if (!username || !license) {
            return res.sendStatus(400);
        }
        const Licenses = await (0, licenses_1.getLicenseByLicenseAndUsername)(license, username);
        if (!Licenses) {
            return res.sendStatus(404);
        }
        Licenses.status = Licenses.status === "active" ? "inactive" : "active";
        Licenses.save();
        return res.send(Licenses.status).status(200).end();
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
};
exports.ActiveControl = ActiveControl;
//# sourceMappingURL=licenses.js.map