import express from 'express';

import {addScript} from '../controllers/scripts';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/script', isAuthenticated,isStaff,addScript)
}   