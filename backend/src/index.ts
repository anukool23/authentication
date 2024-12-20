import express from "express";
import "dotenv/config"
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:APP_ORIGIN,
    credentials:true
}))

app.get("/health",(req,res)=>{
    res.status(200).json({
        status:"Health check OK"
    })
})

app.use(errorHandler)

app.listen((PORT),async ()=>{
    await connectToDatabase();
    console.log(`Server is running on port ${PORT} in ${NODE_ENV}`);
})