import { User } from "../models/user.models.js";
import ApiError from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
const generateToken = async (userId)=>{
    const user = await User.findById(userId);
    if(!user) {
        throw new ApiError(400,"User not Found")
    }
    const accessToken=await user.generateAccessToken();
    const refreshAccessToken = user.generateRefreshAccessToken();
    user.refreshAccessToken = refreshAccessToken;
    await user.save({ validateBeforeSave: false }); //Saving it in the user
    return { accessToken, refreshAccessToken };
}
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
const newlycreatedUser=await User.findById(user._id).select("-password -accessToken")
if(!newlycreatedUser){
    throw new ApiError(400,"Failed to get user")
}
return res.status(200).json(new ApiResponse(200,newlycreatedUser,"User Created Successfully"))

})
const loginUser=asyncHandler(async(req,res)=>{
    const {userName,password}=req.body
    if(!userName){
        throw new ApiError(400,"UserName not provided")
    }
    if(!password){
        throw new ApiError(400,"Password not provided")
    }
    const user=await User.findOne({userName})
    if(!user){
        throw new ApiError(400,"The user is not registered")
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Password is incorrect")
    }
    const { accessToken, refreshAccessToken }=await generateToken(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const Options = {
        httpOnly: false,
        secure: true,
        sameSite:'None',
    };
    return res
            .status(200)
            .cookie("accessToken",accessToken,Options)
            .cookie("refreshAccessToken",refreshAccessToken,Options)
            .json(new ApiResponse(200, loggedInUser,"User logged in successfully"))



})
const logoutUser=asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $unset: { refreshToken: 1 },
        },
        { new: true }
      );
    
      const Options = {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        path: '/', // Ensure the path is set correctly
      };
    
      return res
        .status(200)
        .clearCookie("accessToken", Options)
        .clearCookie("refreshAccessToken", Options)
        .json(new ApiResponse(200, "User logged out successfully!!"));
    });
export{
    registerUser,loginUser,logoutUser
}