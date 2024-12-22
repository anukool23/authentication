import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model"
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type RefreshTokenPayload = {
    sessionId:SessionDocument["_id"];
};

export type AccessTokenPayload = {
    sessionId:SessionDocument["_id"];
    userId:UserDocument["_id"];
};

type SignOptionsAndSecrets = SignOptions & {
    secret :string
}

export const defaults: SignOptions = {
    audience: ["user"],
}

export const accessTokenSignOptions: SignOptionsAndSecrets = {
    expiresIn: "15m",
    secret: JWT_SECRET
}

export const refreshTokenSignOptions: SignOptionsAndSecrets = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET
}


export const signToken= (
    payload: AccessTokenPayload | RefreshTokenPayload,
    options?:SignOptionsAndSecrets
) => {
    const {secret, ...signOpts} = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, {...defaults, ...signOpts})
}


export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token:string,
    options?:VerifyOptions & {secret?:string}
) => {
        const {secret = JWT_SECRET, ...verifyOpts} = options || {};
        try {
            const payload = jwt.verify(token, secret, {...defaults, ...verifyOpts}) as TPayload
            return {
                payload
            };
        } catch (error:any) {
            return {
                error: error.message
            };
        };
};