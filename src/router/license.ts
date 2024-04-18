import express from 'express';

import {Addlicense,getAllLicenses,Checklicense,delete_a_license,ResetLicense,getAllLicenseForUser,ActiveControl} from '../controllers/licenses';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.get('/license', isAuthenticated,isStaff,getAllLicenses)
    router.post('/checkLicense',Checklicense)
    router.post('/license', isAuthenticated,Addlicense)
    router.put('/license', isAuthenticated,ResetLicense)
    router.delete('/license', isAuthenticated,isStaff,delete_a_license)
    router.post('/license/user', isAuthenticated,getAllLicenseForUser)
    router.post('/license/activeControl', isAuthenticated,ActiveControl)
}