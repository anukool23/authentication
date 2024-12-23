import { CREATED, OK } from "../constants/http";
import sessionModel from "../models/session.model";
import { createAccount, loginUser } from "../services/auth.services";
import catchErrors from "../utils/cathcErrors";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "./auth.schema";


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