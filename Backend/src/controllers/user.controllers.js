import { User } from "../models/user.models.js";
import ApiError from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const registerUser=asyncHandler(async(req,res)=>{
const{userName,email,password,fullName,address,age,gender}=req.body
if(!userName){
    throw new ApiError(400,"UserName not provided")
}
if(!email){
    throw new ApiError(400,"Email not provided")
    }
if(!password){
    throw new ApiError(400,"Password not provided")
}
if(!fullName){
    throw new ApiError(400,"Full Name not provided")
}
if(!address){
    throw new ApiError(400,"Address not provided")
}
if(!age){
    throw new ApiError(400,"Age not provided")
}
if(!gender){
    throw new ApiError(400,"Gender not provided")
}
const userExist=await User.findOne({userName})
if(userExist){
    throw new ApiError(400,"User already exist")
}
const user=await User.create({
    userName,
    email,
    password,
    fullName,
    address,
    age,
    gender})
if(!user){
    throw new ApiError(400,"Failed to create user")
}
const newlycreatedUser=await User.findById(user._id).select("- password accessToken")
if(!newlycreatedUser){
    throw new ApiError(400,"Failed to get user")
}
return res.status(200).json(new ApiResponse(200,newlycreatedUser,"User Created Successfully"))

})
export{
    registerUser
}