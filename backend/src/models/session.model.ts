import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";



export interface SessionDocument extends mongoose.Document{
    userId: mongoose.Types.ObjectId;
    userAgent?:string;
    expiresAt:Date;
    createdAt:Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"User",index:true},
    userAgent:{ type:String},
    createdAt:{type:Date, required:true, default:Date.now},
    expiresAt:{type:Date, required:true, default: thirtyDaysFromNow}
});

const sessionModel = mongoose.model<SessionDocument>(
    "session",sessionSchema
);

export default sessionModel;