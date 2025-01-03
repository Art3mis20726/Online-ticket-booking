import {User} from "../models/user.models.js";
import ApiError from "../utils/apiError.utils.js";
import asyncHandler  from "../utils/asyncHandler.utils.js"
import jwt from "jsonwebtoken"
export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken;
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshAccessToken")
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    req.user=user;
    next()  
    } catch (error) {
        console.log("Invalid access token",error)
    }
})