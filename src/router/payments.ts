import express from 'express';
import {generatorQr,buyScript} from '../controllers/payments';

import {isAuthenticated,getIP,isStaff} from '../middlewares';
import {verifySlip,uploadSlip} from '../middlewares/payments';

export default (router: express.Router) => {
    router.post('/payment/generator',isAuthenticated,generatorQr)
    router.post('/payment/checkout',isAuthenticated,uploadSlip,verifySlip,buyScript)
}