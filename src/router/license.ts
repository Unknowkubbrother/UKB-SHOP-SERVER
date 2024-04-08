import express from 'express';

import {addLicense,getAllLicenses,Checklicense,delete_a_license,ResetLicense,getAllLicenseForUser} from '../controllers/licenses';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.get('/license', isAuthenticated,isStaff,getAllLicenses)
    router.post('/checkLicense',getIP,Checklicense)
    router.post('/license', isAuthenticated,addLicense)
    router.put('/license', isAuthenticated,ResetLicense)
    router.delete('/license', isAuthenticated,isStaff,delete_a_license)
    router.get('/license/user', isAuthenticated,getAllLicenseForUser)
}   