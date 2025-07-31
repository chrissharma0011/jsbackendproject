import { Router } from "express";
import { registeruser } from "../src/controllers/user.controllers.js";
import { upload } from "../src/middlewares/multer.middleware.js";
import { User } from "../src/models/users.model.js";
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
           name:"coverimage",
           maxCount:1
        }
    ]),
    
    
    registeruser)

export default router

