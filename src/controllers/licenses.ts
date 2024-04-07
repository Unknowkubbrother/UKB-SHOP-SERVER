require('dotenv').config();
import express from 'express';
import {getLicense,createLicense,getLicenses,checkLicense,deleteLicense,getLicenseByLicenseAndUsername,getLicenseByUsername} from '../models/licenses';
import {getScript} from '../models/scripts';
import {random,generateLicense} from '../helpers';
import { Discordwebhook } from '../webhook';


export const addLicense = async (req: express.Request, res: express.Response) => { 
    try{
        const {nameScript,ipaddress,username} = req.body;
        const license = `license-${nameScript}-${generateLicense(nameScript,ipaddress)}`;
        if(!license || !nameScript || !ipaddress || !username){
            return res.sendStatus(400);
        }
        const License = await getLicense(license);
        if(License){
            return res.sendStatus(409);
        }

        const newLicense = await createLicense({
            license,
            nameScript,
            ipaddress,
            owner: username
        });

        return res.status(201).json(newLicense).end();
        

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const getAllLicenses = async (req: express.Request, res: express.Response) => {
    try{
        const licenses = await getLicenses();
        return res.json(licenses).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const delete_a_license = async (req: express.Request, res: express.Response) => {
    try{
        const {license,username} = req.body;
        if(!license || !username){
            return res.sendStatus(400);
        }
        const License = await deleteLicense(license)
        if(!License){
            return res.sendStatus(404);
        }
        return res.send("License deleted successfully!").status(200).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const Checklicense = async (req: express.Request, res: express.Response) => {
    try{
        const {license,ipaddress,username} = req.body;
        if(!license || !ipaddress){
            return res.sendStatus(400);
        }
        const License = await checkLicense(license,ipaddress,username);
        if(!License){
            return res.sendStatus(404);
        }

        if(License.status === 'inactive'){
            return res.send("License is inactive").status(200).end();
        }

        
        const Script = await getScript(License.nameScript);
        if(!Script){
            return res.sendStatus(404);
        }

        if(Script.status === 'inactive'){
            return res.send("Script is inactive").status(200).end();
        }
        
        Discordwebhook(License.nameScript,ipaddress,License.owner,Script.webhook);
        return res.send(License.nameScript).status(200).end();
       
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const ResetLicense = async (req: express.Request, res: express.Response) => {
    try{
        const {license,username,Newipaddress} = req.body;
        if(!license || !username || !Newipaddress){
            return res.sendStatus(400);
        }
        const licenseSplit = license.split("-");
        const License = await getLicenseByLicenseAndUsername(license,username);
        if(!License){
            return res.sendStatus(404);
        }
        const Newlicense = `license-${licenseSplit[1]}-${generateLicense(licenseSplit[1],Newipaddress)}`;
        License.license = Newlicense;
        License.ipaddress = Newipaddress;
        License.save();
        return res.json(License).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllLicenseForUser = async (req: express.Request, res: express.Response) => {
    try{
        const {username} = req.body;
        if(!username){
            return res.sendStatus(400);
        }
        const Licenses = await getLicenseByUsername(username);
        if(!Licenses){
            return res.sendStatus(404);
        }
        return res.json(Licenses).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

