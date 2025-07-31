import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/apiresponse.js";
const registeruser=asyncHandler(async(req,res)=>{
        /*const {fullname,email,username,password}=req.body()
        if(fullname===""){
          throw new ApiError(400,"full name required")
        }*/

        if( 
          [fullname,email,username,password].some((field)=>field?.trim()==="")
        ){
             throw  new  ApiError(400,"ALL FIELDS REQUIRED")
        }

        const existeduser=User.findOne({
          $or:[
            { username   },{ email   }]
        })
         if(existeduser){
          throw new ApiError(409,"user already exists")
         }

        const localavatarpath= req.files?.avatar[0]?.path
         const localcloudpath= req.files?.coverimage[0]?.path

         if(!localavatarpath){
          throw new ApiError(201)
         }

         const avatar=uploadOnCloudinary(localavatarpath)
         const image=uploadOnCloudinary(localcloudpath)

         if(avatar){
          throw new ApiError
         }
       const user= await  User.create({
          fullname,
          avatar:avatar.url,
          coverimage:image?.url ||"",
          email,
          password,
          username:username.tolowercase()

          
         })
       const is =  await user.findbyid(user._id)
       if(is){
        throw new ApiError
       }
      const createduser= await User.findById(user._id).select(
        "-password -refreshtoken"
      )
      if(!createduser){
        throw new ApiError(400,"somethung went wrong ")
      }
      return res(200).json(
        new ApiResponse(200,createduser,"successful account createed")
      )
})
export {registeruser}