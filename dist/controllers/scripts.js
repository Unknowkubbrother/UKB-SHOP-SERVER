"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVersionByStaff = exports.UpdateScriptByStaff = exports.deleteScriptByStaff = exports.getScriptByid = exports.getScriptsHome = exports.getScriptsStore = exports.getAllScriptsByStaff = exports.getScriptByidForStaff = exports.addScriptbyStaff = void 0;
require('dotenv').config();
const scripts_1 = require("../models/scripts");
const licenses_1 = require("../models/licenses");
const addScriptbyStaff = async (req, res) => {
    try {
        const { nameScript, shortDescription, description, plan, thumbnail, video, image, Changelogs, webhook, download, recommended } = req.body;
        if (!nameScript || !shortDescription || !description || !plan || !thumbnail || !image || !Changelogs || !webhook || !download) {
            return res.sendStatus(400);
        }
        const Scripts = await (0, scripts_1.getScriptByName)(nameScript);
        if (Scripts) {
            return res.sendStatus(409);
        }
        const newScript = await (0, scripts_1.createScript)({
            nameScript,
            shortDescription,
            description,
            plan,
            thumbnail,
            video,
            image,
            Changelogs,
            webhook,
            download,
            recommended
        });
        return res.status(201).json(newScript).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.addScriptbyStaff = addScriptbyStaff;
const getScriptByidForStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const scripts = await (0, scripts_1.getScriptById)(id);
        if (!scripts) {
            return res.sendStatus(404);
        }
        const scriptsList = {
            id: scripts._id,
            nameScript: scripts.nameScript,
            shortDescription: scripts.shortDescription,
            description: scripts.description,
            plan: scripts.plan,
            thumbnail: scripts.thumbnail,
            video: scripts.video,
            image: scripts.image,
            Changelogs: scripts.Changelogs,
            recommended: scripts.recommended,
            webhook: scripts.webhook,
            download: scripts.download,
            status: scripts.status,
        };
        return res.status(200).json(scriptsList).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getScriptByidForStaff = getScriptByidForStaff;
const getAllScriptsByStaff = async (req, res) => {
    try {
        const scripts = await (0, scripts_1.getScriptsByStaff)();
        const scriptsList = scripts.map((script) => {
            return {
                id: script._id,
                nameScript: script.nameScript,
                shortDescription: script.shortDescription,
                description: script.description,
                plan: script.plan,
                thumbnail: script.thumbnail,
                video: script.video,
                image: script.image,
                Changelogs: script.Changelogs,
                recommended: script.recommended,
                webhook: script.webhook,
                download: script.download,
                status: script.status,
            };
        });
        return res.status(200).json(scriptsList).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllScriptsByStaff = getAllScriptsByStaff;
const getScriptsStore = async (req, res) => {
    try {
        const scripts = await (0, scripts_1.getScripts)();
        const scriptsList = scripts.map((script) => {
            return {
                id: script._id,
                nameScript: script.nameScript,
                shortDescription: script.shortDescription,
                plan: script.plan,
                thumbnail: script.thumbnail,
            };
        });
        return res.status(200).json(scriptsList).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getScriptsStore = getScriptsStore;
const getScriptsHome = async (req, res) => {
    try {
        const scripts = await (0, scripts_1.getScriptsRecommended)();
        const scriptsList = scripts.map((script) => {
            return {
                id: script._id,
                nameScript: script.nameScript,
                thumbnail: script.thumbnail
            };
        });
        return res.status(200).json(scriptsList).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getScriptsHome = getScriptsHome;
const getScriptByid = async (req, res) => {
    try {
        const { id } = req.params;
        const scripts = await (0, scripts_1.getScriptById)(id);
        if (!scripts) {
            return res.sendStatus(404);
        }
        const scriptsList = {
            id: scripts._id,
            nameScript: scripts.nameScript,
            description: scripts.description,
            plan: scripts.plan,
            thumbnail: scripts.thumbnail,
            video: scripts.video,
            image: scripts.image,
            Changelogs: scripts.Changelogs,
            status: scripts.status,
        };
        return res.status(200).json(scriptsList).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getScriptByid = getScriptByid;
const deleteScriptByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const script = await (0, scripts_1.deleteScript)(id);
        await (0, licenses_1.deleteManyLicenseByScriptId)(id);
        if (!script) {
            return res.sendStatus(404);
        }
        return res.send("Script deleted successfully!").status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteScriptByStaff = deleteScriptByStaff;
const UpdateScriptByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameScript, shortDescription, description, plan, thumbnail, video, image, Changelogs, webhook, download, recommended, status } = req.body;
        if (!nameScript || !shortDescription || !description || !plan || !thumbnail || !image || !Changelogs || !webhook || !download || !status) {
            return res.sendStatus(400);
        }
        const script = await (0, scripts_1.updateScriptById)(id, {
            nameScript,
            shortDescription,
            description,
            plan,
            thumbnail,
            video,
            image,
            Changelogs,
            webhook,
            download,
            recommended,
            status
        });
        if (!script) {
            return res.sendStatus(404);
        }
        return res.status(200).json(script).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.UpdateScriptByStaff = UpdateScriptByStaff;
const UpdateVersionByStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { Changelogs, download } = req.body;
        if (!Changelogs || !download) {
            return res.sendStatus(400);
        }
        const script = await (0, scripts_1.getScriptById)(id);
        if (!script) {
            return res.sendStatus(404);
        }
        const updatedChangelogs = [...script.Changelogs, ...Changelogs];
        const updatedScript = await (0, scripts_1.updateScriptById)(id, {
            Changelogs: updatedChangelogs,
            download
        });
        if (!updatedScript) {
            return res.sendStatus(404);
        }
        return res.status(200).send({
            Chanelogs: script.Changelogs,
            download: script.download
        }).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.UpdateVersionByStaff = UpdateVersionByStaff;
//# sourceMappingURL=scripts.js.map