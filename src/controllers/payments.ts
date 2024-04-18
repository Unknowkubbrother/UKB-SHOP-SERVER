require("dotenv").config();
import generatePayload from 'promptpay-qr';
import qrcode from 'qrcode';
import express from 'express';
import { createPayment } from '../models/payments';
import { createLicense } from '../models/licenses';

export const generatorQr = async (req: express.Request, res: express.Response) => {
    try {
        const {mobileNumber,amount}: {mobileNumber: string, amount: number} = req.body;

        
        if(!mobileNumber || !amount || amount <= 0 || !(mobileNumber.length  == 10)){
            return res.sendStatus(400);
        }

        const generQRCode = (payload: string) => {
            const options: any = { type: 'svg', color: { dark: '#000', light: '#fff' } };
            let QrcodeSvg: string = "";
            qrcode.toString(payload, options, (err, svg) => {
                if (err) return console.log(err)
                QrcodeSvg = svg;
            })
            return QrcodeSvg;
        }

        const payload : string = await generatePayload(mobileNumber, {amount})
        const svg = await generQRCode(payload);
        return res.status(200).send(svg)

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const buyScript = async (req: express.Request, res: express.Response) => {
    try{
        const {transRefId,data,total,dateSlip,username} = req.body;
        if(!transRefId || !data || !total || !dateSlip || !username){
            return res.sendStatus(400);
        }
        const slip = await createPayment({
            transRefId,
            data,
            total,
            dateSlip,
            username
        });
        
        if(!slip){
            return res.sendStatus(400);
        }

    if(process.env.TimeZoneTH == "true"){
        await data.forEach(async (license: any) => {
            const {nameScript,scriptId,Plan} = license;
            if(!nameScript || !scriptId || !Plan || !username){
                return res.sendStatus(400);
            }
            await createLicense({
                nameScript: nameScript,
                scriptId: scriptId,
                rent:{
                    status: (Plan.rent.status) ? true : false,
                    startDate: (Plan.rent.status) ? Date.now() + (7 * 60 * 60 * 1000) : 0,
                    endDate: (Plan.rent.status) ? Date.now() + (Plan.rent.day * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000): 0
                },
                owner: username
            });
        });
        }else{
            await data.forEach(async (license: any) => {
                const {nameScript,scriptId,Plan} = license;
                if(!nameScript || !scriptId || !Plan || !username){
                    return res.sendStatus(400);
                }
                await createLicense({
                    nameScript: nameScript,
                    scriptId: scriptId,
                    rent:{
                        status: (Plan.rent.status) ? true : false,
                        startDate: (Plan.rent.status) ? Date.now() : 0,
                        endDate: (Plan.rent.status) ? Date.now() + (Plan.rent.day * 24 * 60 * 60 * 1000): 0
                    },
                    owner: username
                });
            });
        }
        
        return res.status(201).json(slip).end();
    
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}