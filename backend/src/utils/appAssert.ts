import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";
import AppError from "./AppError";
import assert from "node:assert"


type AppAssert = (
    condition:any,
    HttpStatusCode:HttpStatusCode,
    message:string,
    AppErrorCode?:AppErrorCode
) => asserts condition;

//Asserts a condition and throws an App error if the condition is falsy.

const appAssert: AppAssert = (
    condition,
    HttpStatusCode,
    message,
    AppErrorCode
) => assert(
    condition, new AppError(HttpStatusCode, message, AppErrorCode)
);

export default appAssert;