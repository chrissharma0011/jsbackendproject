import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";
import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("server is listening ");

    })
    
})
.catch(()=>[
    console.log("there is error here")
])












/*(async()=>{
    try {
        
        await mongoose.connect('${process.env.DATABASE_URI }/${DB_NAME}');
        console.log("Database connected successfully");
        application.on( "error", (err) => {
            console.error("Database connection error:", err);
        })
        application.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);})
    
    }
        
      catch (error) {
        console.error("Database connection failed:", error);
    }

})()*/