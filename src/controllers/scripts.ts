require('dotenv').config();
import express from 'express';
import {createScript,getScriptById,getScripts,deleteScript,getScriptByName,updateScriptById} from '../models/scripts';
import {random} from '../helpers';


export const addScript = async (req: express.Request, res: express.Response) => { 
    try{
        const {nameScript,description,trade,webhook,promote,Changelogs,recommended,download} = req.body;
        if(!nameScript || !description || !trade || !webhook || !promote || !Changelogs || !download){
            return res.sendStatus(400);
        }

        const Scripts = await getScriptByName(nameScript);
        if(Scripts){
            return res.sendStatus(409);
        }

        const newScript = await createScript({
            nameScript,
            description,
            trade,
            webhook,
            promote,
            Changelogs,
            download,
            recommended
        });
        return res.status(201).json(newScript).end();
   

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const getScriptByidForStaff = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const scripts = await getScriptById(id);
        if(!scripts){
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
            webhook: scripts.webhook,
            download: scripts.download,
            status: scripts.status,
        }
        return res.status(200).json(scriptsList).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllScripts = async (req: express.Request, res: express.Response) => {
    try {
        const scripts = await getScripts();
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
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getScriptByid = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const scripts = await getScriptById(id);
        if(!scripts){
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
        }
        return res.status(200).json(scriptsList).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const delete_a_Script = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const script = await deleteScript(id);
        if(!script){
            return res.sendStatus(404);
        }
        return res.send("Script deleted successfully!").status(200).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const UpdateScript = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {nameScript,description,trade,webhook,promote,Changelogs,recommended,download,status} = req.body;
        if(!nameScript || !description || !trade || !webhook || !promote || !Changelogs || !download || !status){
            return res.sendStatus(400);
        }
        const script = await updateScriptById(id,{
            nameScript,
            description,
            trade,
            webhook,
            promote,
            Changelogs,
            download,
            recommended,
            status
        });

        if(!script){
            return res.sendStatus(404);
        }

        return res.status(200).json(script).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const UpdateVersion = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {Changelogs,download} = req.body;
        if(!Changelogs || !download){
            return res.sendStatus(400);
        }
        const script = await getScriptById(id);
        if(!script){
            return res.sendStatus(404);
        }
        const updatedChangelogs = [...script.Changelogs, ...Changelogs];
        const updatedScript = await updateScriptById(id, {
            Changelogs: updatedChangelogs,
            download
        });
        if(!updatedScript){
            return res.sendStatus(404);
        }
        return res.status(200).send({
            Chanelogs:script.Changelogs,
            download:script.download
        }).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}