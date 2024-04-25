import express from 'express';

import {addScript,getAllScripts,getScriptByid,delete_a_Script,getScriptByidForStaff,UpdateScript,UpdateVersion} from '../controllers/scripts';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/script', isAuthenticated,isStaff,addScript)
    router.get('/script',getAllScripts)
    router.get('/script/:id',getScriptByid)
    router.get('/script_admin/:id',isAuthenticated,isStaff,getScriptByidForStaff)
    router.delete('/script/:id', isAuthenticated,isStaff,delete_a_Script)
    router.put('/script/:id', isAuthenticated,isStaff,UpdateScript)
    router.put('/script_version/:id', isAuthenticated,isStaff,UpdateVersion)
}   