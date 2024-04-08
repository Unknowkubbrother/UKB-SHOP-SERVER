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
        var ip = (function (req) {
            var ipaddr = require('ipaddr.js');
            var ipString = ((req.headers["X-Forwarded-For"] ||
                req.headers["x-forwarded-for"] ||
                '') as string).split(',')[0] ||
                req.socket.remoteAddress;
                // req.connection.remoteAddress;
        
            if (ipaddr.isValid(ipString)) {
                try {
                    var addr = ipaddr.parse(ipString);
                    if (ipaddr.IPv6.isValid(ipString) && addr.isIPv4MappedAddress()) {
                        return addr.toIPv4Address().toString();
                    }
                    return addr.toNormalizedString();
                } catch (e) {
                    return ipString;
                }
            }
            return 'unknown';
        }(req));
        
        req.body.ipaddress = ip;
        return next();

    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}