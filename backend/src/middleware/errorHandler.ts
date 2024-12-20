import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandler:ErrorRequestHandler = (error, req:Request,res:Response,next:NextFunction):any=>{
    console.error(`PATH: ${req.path}, ERROR: ${error}`);
    return res.status(500).send("Internal server error")
};

export default errorHandler