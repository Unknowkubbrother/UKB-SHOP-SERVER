import express from 'express';

import {addScriptbyStaff,getScriptByid,deleteScriptByStaff,getScriptByidForStaff,UpdateScriptByStaff,UpdateVersionByStaff,getScriptsHome,getScriptsStore,getAllScriptsByStaff} from '../controllers/scripts';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/script_admin', isAuthenticated,isStaff,addScriptbyStaff)
    router.get('/store',getScriptsStore)
    router.get('/script_admin',isAuthenticated,isStaff,getAllScriptsByStaff)
    router.get('/script',getScriptsHome)
    router.get('/script/:id',getScriptByid)
    router.get('/script_admin/:id',isAuthenticated,isStaff,getScriptByidForStaff)
    router.delete('/script_admin/:id', isAuthenticated,isStaff,deleteScriptByStaff)
    router.put('/script_admin/:id', isAuthenticated,isStaff,UpdateScriptByStaff)
    router.put('/script_admin_version/:id', isAuthenticated,isStaff,UpdateVersionByStaff)
}   