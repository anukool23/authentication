import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";



const connectToDatabase = async ()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log("DB connection successful")
    }
    catch(err){
        console.log("Error while connection database",err);
        process.exit(1)
    }
}

export default connectToDatabase;