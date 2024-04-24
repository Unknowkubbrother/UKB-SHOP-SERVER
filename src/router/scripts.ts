import express from 'express';

import {addScript,getAllScripts,getScriptByid,delete_a_Script} from '../controllers/scripts';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/script', isAuthenticated,isStaff,addScript)
    router.get('/script',getAllScripts)
    router.get('/script/:id',getScriptByid)
    router.delete('/script/:id', isAuthenticated,isStaff,delete_a_Script)
}   