/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtil } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth = (...allowedRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) =>{
    try {
        // session token check
        const sessionToken = CookieUtil.getCookie(req, "better-auth.session_token");
        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: No session token provided");
        }

        if(sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })
            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = sessionExists.expiresAt;
                const createdAt = sessionExists.createdAt;

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const remainingTime = expiresAt.getTime() - now.getTime();
                const percentRemaining = (remainingTime / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", remainingTime.toString());

                    console.log("Session is nearing expiration. Consider refreshing the session.");
                }
                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized: User is blocked or deleted");
                }
                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized: User is deleted");
                }
                if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, "Forbidden: User does not have the required role");
                }
            }
            const accessToken = CookieUtil.getCookie(req, "accessToken");
            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized: No access token provided");
            }
        }

        // access token check
        const accessToken = CookieUtil.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: No access token provided");
        }
        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: Invalid access token");
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, "Forbidden: User does not have the required role");
        }

        next();
    } catch (error: any) {
        next(error);
    }
}