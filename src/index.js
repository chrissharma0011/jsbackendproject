import dotenv from "dotenv"

import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})


connectDB()
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