import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const ConnectionInstance =await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log(`\n connection!! :, ${ConnectionInstance.connection.host}`)
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
export default connectDB