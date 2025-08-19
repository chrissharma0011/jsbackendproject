import { Router } from "express";
import { loginuser, logoutuser, registeruser,getUserChannelProfile,getcurrentuser, refreshaccesstoken ,updateUserAvatar,updateUserCoverImage} from "../src/controllers/user.controllers.js";
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

router.route("/current-user").get(verifyjwt, getcurrentuser)
router.route("/refresh-token").post(refreshaccesstoken)

router.route("/c/:username").get(verifyjwt, getUserChannelProfile)
router.route("/avatar").patch(verifyjwt, upload.single("avatar"), updateUserAvatar)
router.route("/coverimage").patch(verifyjwt, upload.single("coverImage"), updateUserCoverImage)
export default router

