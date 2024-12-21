import catchErrors from "../utils/cathcErrors";
import { registerSchema } from "./auth.schema";


export const registerHandler = catchErrors(async (req,res)=>{
    const request = registerSchema.parse({
        ...req.body,
        userAgent : req.headers["user-agent"]
    })
    console.log(request)
})