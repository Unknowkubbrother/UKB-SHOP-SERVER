require('dotenv').config();
import express from 'express';
import {createScript,getScript} from '../models/scripts';
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