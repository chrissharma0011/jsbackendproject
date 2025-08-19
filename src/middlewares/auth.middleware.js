import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js"; // ✅ include .js

export const verifyjwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select("-password -refreshtoken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user; // attach user to request object
    next(); // move to the next middleware/handler
  } catch (error) {
    throw new ApiError(401, "Unauthorized access");
  }
});
