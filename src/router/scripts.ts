import express from 'express';

import {addScript,getAllScripts,getScriptByName,delete_a_Script} from '../controllers/scripts';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/script', isAuthenticated,isStaff,addScript)
    router.get('/script', isAuthenticated,isStaff,getAllScripts)
    router.get('/script/:nameScript', isAuthenticated,isStaff,getScriptByName)
    router.delete('/script/:nameScript', isAuthenticated,isStaff,delete_a_Script)
}   