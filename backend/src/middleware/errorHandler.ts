import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";


const handleZodError = (res:Response, error:z.ZodError) =>{
    const errors = error.issues.map((err)=>({
        path: err.path.join("."),
        message: err.message,
    }));
    return res.status(BAD_REQUEST).json({
        errors,
        message:error.message,
    });
};
const errorHandler:ErrorRequestHandler = (error, req:Request,res:Response,next:NextFunction):any=>{
    console.error(`PATH: ${req.path}, ERROR: ${error}`);

    if(error instanceof z.ZodError){
        return handleZodError(res,error);
    }

    return res.status(INTERNAL_SERVER_ERROR).send("Internal server error")
};

export default errorHandler