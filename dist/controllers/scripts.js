"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_a_Script = exports.getScriptByid = exports.getAllScripts = exports.addScript = void 0;
require('dotenv').config();
const scripts_1 = require("../models/scripts");
const addScript = async (req, res) => {
    try {
        const { nameScript, description, trade, webhook, promote, Changelogs, recommended } = req.body;
        if (!nameScript || !description || !trade || !webhook || !promote || !Changelogs || !recommended) {
            return res.sendStatus(400);
        }
        const Scripts = await (0, scripts_1.getScriptByName)(nameScript);
        if (Scripts) {
            return res.sendStatus(409);
        }
        const newScript = await (0, scripts_1.createScript)({
            nameScript,
            description,
            trade,
            webhook,
            promote,
            Changelogs,
            recommended
        });
        return res.status(201).json(newScript).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.addScript = addScript;
const getAllScripts = async (req, res) => {
    try {
        const scripts = await (0, scripts_1.getScripts)();
        const scriptsList = scripts.map((script) => {
            return {
                id: script._id,
                nameScript: script.nameScript,
                description: script.description,
                trade: script.trade,
                promote: script.promote,
                Changelogs: script.Changelogs,
                recommended: script.recommended,
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
exports.getAllScripts = getAllScripts;
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
            trade: scripts.trade,
            promote: scripts.promote,
            Changelogs: scripts.Changelogs,
            recommended: scripts.recommended,
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
const delete_a_Script = async (req, res) => {
    try {
        const { nameScript } = req.params;
        const script = await (0, scripts_1.deleteScript)(nameScript);
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
exports.delete_a_Script = delete_a_Script;
//# sourceMappingURL=scripts.js.map