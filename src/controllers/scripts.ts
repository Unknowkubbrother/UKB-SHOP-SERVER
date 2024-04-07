require('dotenv').config();
import express from 'express';
import {createScript,getScript,getScripts,deleteScript} from '../models/scripts';
import {random} from '../helpers';


export const addScript = async (req: express.Request, res: express.Response) => { 
    try{
        const {nameScript,description,price,webhook} = req.body;
        if(!nameScript || !description || !price || !webhook){
            return res.sendStatus(400);
        }

        const Scripts = await getScript(nameScript);
        if(Scripts){
            return res.sendStatus(409);
        }

        const newScript = await createScript({
            nameScript,
            description,
            price,
            webhook
        });
        return res.status(201).json(newScript).end();
   

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const getAllScripts = async (req: express.Request, res: express.Response) => {
    try {
        const scripts = await getScripts();
        return res.status(200).json(scripts).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getScriptByName = async (req: express.Request, res: express.Response) => {
    try {
        const {nameScript} = req.params;
        const script = await getScript(nameScript);
        if(!script){
            return res.sendStatus(404);
        }
        return res.status(200).json(script).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

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

export const delete_a_Script = async (req: express.Request, res: express.Response) => {
    try {
        const {nameScript} = req.params;
        const script = await deleteScript(nameScript);
        if(!script){
            return res.sendStatus(404);
        }
        return res.send("Script deleted successfully!").status(200).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}