import express from "express";
import "dotenv/config"
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:APP_ORIGIN,
    credentials:true
}))

app.get("/health",(req,res,next)=>{
    res.status(OK).json({
        status:"Health check OK"
    });
});

app.use("/auth",authRoutes)

app.use(errorHandler)

app.listen((PORT),async ()=>{
    await connectToDatabase();
    console.log(`Server is running on port ${PORT} in ${NODE_ENV}`);
})