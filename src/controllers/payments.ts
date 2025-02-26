require("dotenv").config();
import generatePayload from 'promptpay-qr';
import qrcode from 'qrcode';
import express from 'express';
import { createPayment,getPaymentsbyUser,getPayments } from '../models/payments';
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
            const {nameScript,scriptId,plan} = license;
            if(!nameScript || !scriptId || !plan || !username){
                return res.sendStatus(400);
            }
            await createLicense({
                nameScript: nameScript,
                scriptId: scriptId,
                rent:{
                    status: (plan.monthly || plan.day ) ? true : false,
                    startDate: (plan.monthly || plan.day) ? Date.now() + (7 * 60 * 60 * 1000) : 0,
                    endDate: (plan.monthly) ? Date.now() + (31 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000): (plan.day) ? Date.now() + (plan.day * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000): 0
                },
                owner: username
            });
        });
        }else{
            await data.forEach(async (license: any) => {
                const {nameScript,scriptId,plan} = license;
                if(!nameScript || !scriptId || !plan || !username){
                    return res.sendStatus(400);
                }
                await createLicense({
                    nameScript: nameScript,
                    scriptId: scriptId,
                    rent:{
                        status: (plan.monthly || plan.day) ? true : false,
                        startDate: (plan.monthly || plan.day) ? Date.now() : 0,
                        endDate: (plan.monthly) ? Date.now() + (31 * 24 * 60 * 60 * 1000): (plan.day) ? Date.now() + (plan.day * 24 * 60 * 60 * 1000): 0
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

export const getpeymentForUser = async (req: express.Request, res: express.Response) => {
    try{
        const {username} = req.body;
        if(!username){
            return res.sendStatus(400);
        }
        const payments = await getPaymentsbyUser(username);
        if(!payments){
            return res.sendStatus(404);
        }
        return res.status(200).json(payments).end();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllpayments = async (req: express.Request, res: express.Response) => {
    try{
        const payments = await getPayments();
        if(!payments){
            return res.sendStatus(404);
        }
        return res.status(200).json(payments).end();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
    
}