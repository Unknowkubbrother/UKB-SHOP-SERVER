require('dotenv').config();
import express from 'express';
import {createUser,getUserByUsername,getUserBySessionToken,getUserByEmail} from '../models/users';
import { random, authentication, getUserResponse } from '../helpers';



export const register = async (req: express.Request, res: express.Response) => {
    try{
         const {email,username,password,confirmPassword} = req.body;
        
         if(!username || !email || !password || !confirmPassword){
            return res.sendStatus(400);
         }

        if(password !== confirmPassword){
            return res.sendStatus(400);
        }

        const existingUser  = await getUserByUsername(username);
        if(existingUser){
            return res.sendStatus(409);
        }

        const existingEmail = await getUserByEmail(email);
        if(existingEmail){
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                password: authentication(salt, password),
                salt,
            }
        })

        const responseUser = getUserResponse(user);

        return res.status(201).json(responseUser).end();


    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try{
        const { username, password } = req.body;
        if(!username || !password) {
            return res.sendStatus(401);
        }

        const user = await getUserByUsername(username).select('+authentication.salt +authentication.password');
        if(!user) {
            return res.sendStatus(401);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(expectedHash !== user.authentication.password) {
            return res.sendStatus(401);
        }

        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(401);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        if (!user.authentication.sessionToken) {
            return res.sendStatus(401);
        }
        res.cookie(process.env.COOKIE_NAME || 'ukb-auth', user.authentication.sessionToken, { 
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: '.unknowkubbrother.net'
        });
        res.cookie('ukb-data', JSON.stringify({
            username: user.username,
            email: user.email,
            _id: user._id
        }), { 
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: '.unknowkubbrother.net'
        });
        res.cookie('logged_in', 'true', { 
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain: '.unknowkubbrother.net'
        });
        console.log('setted cookie', user.authentication.sessionToken)
        const responseUser = getUserResponse(user);

        return res.status(200).json(responseUser).end();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const loginBySessionToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        if(!sessionToken) {
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(sessionToken);
        if(!user) {
            return res.sendStatus(400);
        }

        const responseUser = getUserResponse(user);

        return res.status(200).json(responseUser).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        console.log('sessionToken: ', sessionToken);
        // const {sessionToken} = req.body;
        if(!sessionToken) {
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(sessionToken);
        if(!user) {
            return res.sendStatus(400);
        }

        user.authentication.sessionToken = '';
        await user.save();
        // clear cookies
        res.clearCookie(process.env.COOKIE_NAME || 'ukb-auth', {path: '/'});

        res.clearCookie('logged_in', {path: '/'});

        res.clearCookie('username', {path: '/'});

        return res.sendStatus(200);

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}