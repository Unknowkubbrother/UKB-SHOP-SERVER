require('dotenv').config();
import express from 'express';
import nodemailer from 'nodemailer';
import {createUser,getUserByUsername,getUserBySessionToken,getUserByEmail,getUsers} from '../models/users';
import { random, authentication, getUserResponse } from '../helpers';
import jwt from 'jsonwebtoken';



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
            domain:process.env.domainAPI
        });
        res.cookie('ukb-data', JSON.stringify({
            username: user.username,
            email: user.email,
            _id: user._id,
            role: user.role
        }), { 
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain:process.env.domainAPI
        });
        res.cookie('logged_in', 'true', { 
            maxAge: 1800000,
            sameSite: 'none', // Add the sameSite option
            secure: true, // Add the secure option for HTTPS
            domain:process.env.domainAPI
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
        console.log('loginBySessionToken: ', sessionToken)
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
        res.clearCookie(process.env.COOKIE_NAME || 'ukb-auth', {path: '/',domain:process.env.domainAPI});

        res.clearCookie('logged_in', {path: '/',domain:process.env.domainAPI});

        res.clearCookie('ukb-data', {path: '/',domain: process.env.domainAPI});

        return res.sendStatus(200);

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllUser = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}


const JWT_SECRET = 'Ux4yZZfNRT0FDpSOeQFg4+LtJOYMV/p+DaD+gk2VqcfLJwclteSsjHrsojw/lVQB29ajZDoiAeTd8XiwmErKIU1nARF4JUcmXvqWrTp26+wWqRkFeLigX6nmUMBUNjj/HxazfCyzshqoX9wszv';

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    try {
        const {email} = req.body;
        if(!email) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.password');
        if(!user) {
            return res.sendStatus(404);
        }

        const Secretcode = JWT_SECRET + user.authentication.password;
        const token = jwt.sign({ email: user.email }, Secretcode, {
            expiresIn: "5m",
          });
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset For UKB-SHOP',
            text: `Secretcode : ${token}`
        }).then(() => {
            return res.sendStatus(200);
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(400);
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const resetpassword = async (req: express.Request, res: express.Response) => {
    try {
        const {email,token,newPassword} = req.body;
        if(!email || !token || !newPassword) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.password');;
        if(!user) {
            return res.sendStatus(404);
        }

        const Secretcode = JWT_SECRET + user.authentication.password;
        jwt.verify(token, Secretcode, async (err: any, decoded: any) => {
            if(err) {
                return res.status(400).send('Invalid Token').end();
            }

            const salt = random();
            user.authentication.password = authentication(salt, newPassword);
            user.authentication.salt = salt;
            await user.save();
            return res.sendStatus(200);
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
