import { CREATED } from "../constants/http";
import { createAccount } from "../services/auth.services";
import catchErrors from "../utils/cathcErrors";
import { setAuthCookies } from "../utils/cookies";
import { registerSchema } from "./auth.schema";


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