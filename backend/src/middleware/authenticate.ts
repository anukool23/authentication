import { RequestHandler } from "express";
import { UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import  mongoose from 'mongoose';


interface TokenPayload {
    userId: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
}

export const authenticate:RequestHandler = (req,res,next) =>{
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(accessToken, UNAUTHORIZED, "Not authenticated",AppErrorCode.InvalidAccessToken);

    const { error, payload } = verifyToken(accessToken) as { error: string; payload: TokenPayload | undefined };
    appAssert(payload, UNAUTHORIZED, error === "jwt expired" ? "Token expired" : "Invalid Token",AppErrorCode.InvalidAccessToken);

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();

}
