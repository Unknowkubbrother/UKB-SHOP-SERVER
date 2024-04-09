"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_a_Script = exports.getScriptByName = exports.getAllScripts = exports.addScript = void 0;
require('dotenv').config();
const scripts_1 = require("../models/scripts");
const addScript = async (req, res) => {
    try {
        const { nameScript, description, price, webhook } = req.body;
        if (!nameScript || !description || !price || !webhook) {
            return res.sendStatus(400);
        }
        const Scripts = await (0, scripts_1.getScript)(nameScript);
        if (Scripts) {
            return res.sendStatus(409);
        }
        const newScript = await (0, scripts_1.createScript)({
            nameScript,
            description,
            price,
            webhook
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
        return res.status(200).json(scripts).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllScripts = getAllScripts;
const getScriptByName = async (req, res) => {
    try {
        const { nameScript } = req.params;
        const script = await (0, scripts_1.getScript)(nameScript);
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
exports.getScriptByName = getScriptByName;
// export const buyScript = async (req: express.Request, res: express.Response) => {
//     try {
//         const {nameScript} = req.params;
//         const script = await getScript(nameScript);
//         if(!script){
//             return res.sendStatus(404);
//         }
//         const {price} = script;
//         const {balance} = req.body;
//         if(balance < price){
//             return res.sendStatus(400);
//         }
//         return res.status(200).json({balance: balance - price}).end();
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }
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