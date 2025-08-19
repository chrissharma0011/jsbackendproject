import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { VideoNew as Video } from "../models/videos.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/apiresponse.js";

// GET all videos for logged-in user
const getAllVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id; // get userId from token

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, no user found" });
    }
       console.log("Authenticated user:", userId);

    
    const videos = await Video.find({ owner: userId });

    res.status(200).json(videos); // returns [] if no videos
});

// Publish/upload a new video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

  
    const localVideoPath = req.files?.videofile?.[0]?.path;
    const localThumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!localVideoPath) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload to Cloudinary
    const videoFile = await uploadOnCloudinary(localVideoPath);
    const thumbnailFile = localThumbnailPath
        ? await uploadOnCloudinary(localThumbnailPath)
        : null;

    if (!videoFile?.url) {
        throw new ApiError(500, "Video upload failed");
    }

    // Save video document in DB
    const video = await Video.create({
        owner: req.user._id, 
        title,
        description,
        videofile: videoFile.url, 
        thumbnail: thumbnailFile?.url || "",
        duration: videoFile.duration || 0, 
    });

    res.status(201).json(
        new ApiResponse(201, video, "Video successfully uploaded")
    );
});

export {
    getAllVideos,
    publishAVideo
};
