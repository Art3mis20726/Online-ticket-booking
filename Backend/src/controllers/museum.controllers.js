import { Museum } from "../models/museum.models.js";
import ApiError from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const registerMuseum=asyncHandler(async(req,res)=>{
const{ name,location,slots}=req.body;
if(!name){
    throw new ApiError(400,"Name is required");

}
if(!location){
    throw new ApiError(400,"Location is required");
}
if(!slots){
    throw new ApiError(400,"Slots are required");
}
const existMuseum=await Museum.findOne({name});
if(existMuseum){
    throw new ApiError(400,"Museum name already exists")
}
const newMuseum=new Museum({name,location,slots});  
if(!newMuseum){
    throw new ApiError(400,"Error in storing the museum information")
}
const newlycreatedMuseum=await Museum.findById(newMuseum._id).select("-bookings")
if(!newlycreatedMuseum){
    throw new ApiError(400,"Error in finding the new meseum")
}
return res.status(200).json(new ApiResponse(200,newlycreatedMuseum,"Museum created successfully"))


})
export{
    registerMuseum
}