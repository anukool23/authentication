import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env";
import { fifteenMinFromNow, thirtyDaysFromNow } from "./date";

 const secure = NODE_ENV !== "development";

 const defaults: CookieOptions={
    sameSite:"strict",
    httpOnly:true,
    secure
 };

 const getAccessTokenCookieOptions =() :CookieOptions =>({
    ...defaults,
    expires: fifteenMinFromNow()
 });

 const getRefreshTokenCookieOptions =() :CookieOptions =>( {
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: "/auth/refresh"
 });

 type Params = {
    res:Response,
    accessToken:string,
    refreshToken:string
 };
 
 export const setAuthCookies = ({ res, accessToken, refreshToken }:Params) =>
    res
 .cookie("accessToken", accessToken , getAccessTokenCookieOptions())
 .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());