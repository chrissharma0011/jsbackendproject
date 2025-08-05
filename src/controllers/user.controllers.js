import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/apiresponse.js";

const registeruser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Log input body and files for debugging
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);

  // Validate required fields
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check for existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // Get image paths from uploaded files
  const localAvatarPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath=req.files?.coverimage?.[0].path;

  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  // Upload to Cloudinary
  const avatar = await uploadOnCloudinary(localAvatarPath);
  const image = await uploadOnCloudinary(coverImageLocalPath) ;

  console.log("Avatar Cloudinary response:", avatar);
  console.log("Cover Cloudinary response:", image);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverimage: image?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log("User created in DB:", user);

  // Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshtoken");

  if (!createdUser) {
    console.error("User not found after creation, ID:", user._id);
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  // Send response
  return res.status(200).json(
    new ApiResponse(200, createdUser, "Successfully created account")
  );
});

export { registeruser };
