import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import { createAccount, loginUser, refreshUserAccessToken, sendPasswordResendEmail, verifyEmail } from "../services/auth.services";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/cathcErrors";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import { emailSchema, loginSchema, registerSchema, verificationCodeSchema } from "./auth.schema";


export const registerHandler = catchErrors(async (req,res)=>{
    const request = registerSchema.parse({
        ...req.body,
        userAgent : req.headers["user-agent"]
    })
    
    //call service
    const {user,refreshToken, accessToken} = await createAccount(request);

    //send response
    return setAuthCookies({res,refreshToken,accessToken})
    .status(CREATED)
    .json(user)
});


export const loginHandler = catchErrors(async (req,res)=>{
    const request = loginSchema.parse(req.body);

    const {accessToken,refreshToken} = await loginUser(request);
    return setAuthCookies({res,refreshToken,accessToken})
    .status(OK)
    .json({
        message:"Login successful"
    })

})

export const logoutHandler = catchErrors(async (req,res)=>{
    const accessToken = req.cookies.accessToken as string | undefined
    const {payload} = verifyToken(accessToken || "")

    if(payload){
        console.log("first")
        await sessionModel.findByIdAndDelete(payload.sessionId)

    }
    return clearAuthCookies(res).status(OK).json({
        message:"Logout successful"
    })
})

export const refreshHandler = catchErrors(async  (req,res)=>{
    const refreshToken = req.cookies.refreshToken as string | undefined
    appAssert(refreshToken,UNAUTHORIZED,"Missing refresh Token");

    const {accessToken, newRefreshToken} = await refreshUserAccessToken(refreshToken);

    if(newRefreshToken){
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }

    return res.status(OK)
    .cookie("accessToken",accessToken, getAccessTokenCookieOptions())
    .json({message:"Access token refreshed"});
});

export const verifyEmailHandler = catchErrors(async (req,res)=>{
    const verificationCode = verificationCodeSchema.parse(req.params.code)
    console.log(verificationCode);
    await verifyEmail(verificationCode)

    return res.status(OK).json({
        "message":"Email successfully verified"
    })
})

export const sendPasswordResetHandler = catchErrors(async (req,res)=>{
    const email = emailSchema.parse(req.body.email)
        await sendPasswordResendEmail(email)
        return res.status(OK).json({
            message:"Password reset email sent"
        })
})