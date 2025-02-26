import express from 'express';

import { login, loginBySessionToken, logout, register,getAllUser,forgotPassword,resetpassword } from '../controllers/authentication';
import {isAuthenticated,getIP,isStaff} from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', register)
    router.post('/auth/login', login);
    router.post('/auth/session', loginBySessionToken);
    router.post('/auth/logout', logout);
    router.get('/auth/user', isAuthenticated,isStaff,getAllUser);
    router.post('/auth/forgot-pass', forgotPassword);
    router.post('/auth/reset-pass', resetpassword);
}