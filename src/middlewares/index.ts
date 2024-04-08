require('dotenv').config();
import Roles from '../enum/roles';
import express from 'express';
import { get, merge } from 'lodash';
import { getUserById, getUserBySessionToken } from '../models/users';

export const isStaff = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const currentUserId = get(req, 'identity._id') as string;
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        const currentUser = await getUserById(currentUserId);
        if (!currentUser) {
            return res.sendStatus(403);
        }

        if (currentUser.role !== Roles.STAFF) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        if (!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_NAME || 'ukb-auth'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        console.log(`${existingUser.username} isAuthenticated middleware!`);
        req.body.username = existingUser.username;
        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getIP  = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        req.body.ipaddress = ip;
        return next();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}