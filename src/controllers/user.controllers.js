import { asyncHandler } from "../utils/asynchandler.js";

const registeruser=asyncHandler(async(requestAnimationFrame,res)=>{
  return   res.status(200).json({
        message:"ok"
    })
})
export {registeruser}