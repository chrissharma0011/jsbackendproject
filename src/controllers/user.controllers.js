import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/apiresponse.js";

import jwt from "jsonwebtoken"
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

const generateAccessTokenandrefreshtokens= async(userid)=>{
            try{
                const user=await User.findById(userid)
                const accesstoken=user.generateAccessToken()
                const refreshtoken=user.generateRefreshToken()

                user.refreshtoken=refreshtoken
                user.save({validiteBeforeSave:false})
                 return {accesstoken,refreshtoken}

            }
            catch(error){
               throw new ApiError(400,"unable to generate tokens")
            }
                    
}

const loginuser=asyncHandler(async(req,res)=>{
  const {email,username,password}=req.body;

   if(!(username || email)){
    throw new ApiError(100,"username or password is required")
   }
    
   const user=await User.findOne({
    $or:[{username},{email}]
   })

   if(!user){
    throw new ApiError(200,"cant find person with this emailand username")
   }

    const truepass=await user.isPasswordCorrect(password)
    if(!truepass){
      throw new ApiError(300,"passwprd incorrext")
    }
  const {accesstoken , refreshtoken}= await generateAccessTokenandrefreshtokens(user._id)
       const finaluser=await User.findById(user._id).select("-password -refreshtoken")

       const options={
        httpOnly:true,
        secure:true
       }

       return res
       .status(200)
       .cookie("refrehtoken",refreshtoken,options)
       .cookie("accesstoken",accesstoken,options)
       .json(
        new ApiResponse(200,
          {
            user:finaluser,refreshtoken,accesstoken
          },
          "user logged successfully"
        ))
       
})
const logoutuser=asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshtoken:undefined
      }
    }
  )
   const options={
        httpOnly:true,
        secure:true
       }
        return res
       .status(200)
       .clearCookie("refrehtoken",options)
       .clearCookie("accesstoken",options)
       .json(
        new ApiResponse(200,
          {
           
          },
          "user logged out successfully"
        ))
})
const refreshaccesstoken=asyncHandler(async(req,res)=>{
  const inrefreshtoken=req.cookies.refreshtoken
  if(!inrefreshtoken){
    throw new ApiError(401,"unathorized access")
  }
  const decodedtoken=jwt.verify(inrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
   
  const user=await User.findById(decodedtoken?._id)
  if(!user){
    throw new ApiError(401,"unauthorized ")
  }
  if (inrefreshtoken!==user?.refreshtoken){
                     throw new ApiError(401,"unauthorized access")
  }
  const options={
    httpOnly:true,
        secure:true
  }
  const {accesstoken,newrefreshtoken}=await user.generateAccessTokenandrefreshtokens(user._id)
  return res.
  status(200)
  .cookie("accesstoken",accesstoken,options)
  .cookie("refreshtoken",newrefreshtoken,options)
  .json(
       new ApiResponse(200,
        {accesstoken,refrehtoken:newrefreshtoken},
        "access token refreshed"
       )
    )})
  

export { registeruser,
  loginuser,
  logoutuser
 };
