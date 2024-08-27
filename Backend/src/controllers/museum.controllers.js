import { Museum } from "../models/museum.models.js";
import ApiError from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const registerMuseum = asyncHandler(async (req, res) => {
    const { name, location, slots } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }
    if (!location) {
        throw new ApiError(400, "Location is required");
    }
    if (!slots) {
        throw new ApiError(400, "Slots are required");
    }

    const existMuseum = await Museum.findOne({ name });
    if (existMuseum) {
        throw new ApiError(400, "Museum name already exists");
    }

    // Initialize weekly slots
    const weeklySlots = Array(7).fill().map(() => ({
        forenoon: slots.forenoon,
        afternoon: slots.afternoon,
    }));

    const newMuseum = await Museum.create({
        name,
        location,
        initialSlots: slots,
        weeklySlots: weeklySlots
    });

    if (!newMuseum) {
        throw new ApiError(400, "Error in storing the museum information");
    }

    const newlyCreatedMuseum = await Museum.findById(newMuseum._id).select("-bookings -weeklySlots");
    if (!newlyCreatedMuseum) {
        throw new ApiError(400, "Error in finding the newly created museum");
    }

    return res.status(200).json(new ApiResponse(200, newlyCreatedMuseum, "Museum created successfully"));
});
const isMuseumAvailable=asyncHandler(async(req,res)=>{
    const {museumName}= req.params
    if(!museumName){
        throw new ApiError(400,"Museum is required")
    }
    
    const museum=await Museum.findOne({name:museumName})
    console.log(museum);
    
    if(!museum){
        return res.status(200).json(new ApiResponse(200,false,"Museum is not available"))
    }else{
    return res.status(200).json(new ApiResponse(200,museum._id,"Museum is available"))}
})

export { registerMuseum ,isMuseumAvailable};

