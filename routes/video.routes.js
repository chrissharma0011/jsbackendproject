import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
} from "../src/controllers/video.controller.js";
import { verifyjwt } from "../src/middlewares/auth.middleware.js";
import { upload } from "../src/middlewares/multer.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes
router.use(verifyjwt);

router
    .route("/all")
    .get(getAllVideos)
    /*.post(
        upload.fields([
            {
                name: "videofile",  
                maxCount: 1,
            },
            {
                name: "thumbnail",  
                maxCount: 1,
            },
        ]),
        publishAVideo
    );*/


    router.get("/test", (req, res) => res.send("Router works!"));

export default router;
