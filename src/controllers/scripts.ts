require('dotenv').config();
import express from 'express';
import {createScript,getScriptById,getScriptsByStaff,deleteScript,getScriptByName,updateScriptById,getScriptsRecommended,getScripts} from '../models/scripts';
import {deleteManyLicenseByScriptId} from '../models/licenses';
import {random} from '../helpers';

export const addScriptbyStaff = async (req: express.Request, res: express.Response) => { 
    try{
        const {nameScript,shortDescription,description,plan,thumbnail,video,image,Changelogs,webhook,download,recommended} = req.body;

        if(!nameScript || !shortDescription || !description || !plan || !thumbnail || !image || !Changelogs || !webhook || !download){
            return res.sendStatus(400);
        }

        const Scripts = await getScriptByName(nameScript);
        if(Scripts){
            return res.sendStatus(409);
        }

        const newScript = await createScript({
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
        }
        return res.status(200).json(scriptsList).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllScriptsByStaff = async (req: express.Request, res: express.Response) => {
    try {
        const scripts = await getScriptsByStaff();
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
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getScriptsStore = async (req: express.Request, res: express.Response) => {
    try{
        const scripts = await getScripts();
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

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getScriptsHome = async (req: express.Request, res: express.Response) => {
    try{
        const scripts = await getScriptsRecommended();
        const scriptsList = scripts.map((script) => {
            return {
                id: script._id,
                nameScript: script.nameScript,
                thumbnail: script.thumbnail
            };
        });
        return res.status(200).json(scriptsList).end();

    }catch(error){
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
            plan: scripts.plan,
            thumbnail: scripts.thumbnail,
            video: scripts.video,
            image: scripts.image,
            Changelogs: scripts.Changelogs,
            status: scripts.status,
        }
        return res.status(200).json(scriptsList).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteScriptByStaff = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const script = await deleteScript(id);
        await deleteManyLicenseByScriptId(id);
        if(!script){
            return res.sendStatus(404);
        }
        return res.send("Script deleted successfully!").status(200).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const UpdateScriptByStaff = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {nameScript,shortDescription,description,plan,thumbnail,video,image,Changelogs,webhook,download,recommended,status} = req.body;
        if(!nameScript || !shortDescription || !description || !plan || !thumbnail || !image || !Changelogs || !webhook || !download || !status){
            return res.sendStatus(400);
        }
        const script = await updateScriptById(id,{
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

        if(!script){
            return res.sendStatus(404);
        }

        return res.status(200).json(script).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const UpdateVersionByStaff = async (req: express.Request, res: express.Response) => {
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