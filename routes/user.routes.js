import { Router } from "express";
import { loginuser, logoutuser, registeruser } from "../src/controllers/user.controllers.js";
import { upload } from "../src/middlewares/multer.middleware.js";
import { User } from "../src/models/users.model.js";
import { verifyjwt } from "../src/middlewares/auth.middleware.js";
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

    router.route("/login").post(loginuser)

    router.route("/logout").post(
        verifyjwt,
        
        logoutuser)

export default router

