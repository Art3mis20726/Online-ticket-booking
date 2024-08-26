import { Booking } from "../models/booking.models.js";
import { Museum } from "../models/museum.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const numberOfSlotsAvailable = asyncHandler(async (req, res) => {
    const { museumId } = req.params;

    if (!museumId) {
        throw new ApiError(400, "Museum Id required");
    }

    const museum = await Museum.findById(museumId).select("weeklySlots");
    if (!museum) {
        throw new ApiError(404, "Museum not found");
    }

    const { weeklySlots } = museum;

    if (!weeklySlots || weeklySlots.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No slots available"));
    }
    const remainingSlots = weeklySlots.map((slots, index) => ({
        forenoon: slots.forenoon,
        afternoon: slots.afternoon
    }));

    return res.status(200).json(new ApiResponse(200, remainingSlots, "Number of slots extracted successfully"));
});
const refreshSlots = asyncHandler(async (req, res) => {
    const museums = await Museum.find();

    for (const museum of museums) {
        const newDaySlots =museum.initialSlots

        museum.weeklySlots.push(newDaySlots);  
        museum.weeklySlots.shift();  

        await museum.save();
    }

    return res.status(200).json(new ApiResponse(200, null, "Slots refreshed successfully"));
});
const ticketGeneration = asyncHandler(async (req, res) => {
    const { museumId } = req.params;
    const { visitors, slot, tickets, totalPrice, paymentId, bookingDayIndex } = req.body;
    const orderId=req.order?.id
    console.log(req.order);
    

    if (!visitors) {
        throw new ApiError(400, "Visitors is required");
    }
    if (!slot) {
        throw new ApiError(400, "Slot is required");
    }
    if (!tickets) {
        throw new ApiError(400, "Number of tickets are required");
    }
    if (!totalPrice) {
        throw new ApiError(400, "Total price is required");
    }
    if (!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const museum = await Museum.findById(museumId);
    if (!museum) {
        throw new ApiError(404, "Museum not found");
    }
    if (!museum.weeklySlots[bookingDayIndex]) {
        throw new ApiError(400, "Invalid booking day");
    }

    const availableSlots = museum.weeklySlots[bookingDayIndex][slot];
    if (availableSlots < tickets) {
        throw new ApiError(400, "Not enough slots available for the selected time slot");
    }
    museum.weeklySlots[bookingDayIndex][slot] -= tickets;

    const newBooking = await Booking.create({
        museumId,
        leaderId: user._id,
        visitors,
        slot,
        tickets,
        totalPrice:req.order?.amount,
        paymentId:orderId,
    });

    if(!newBooking){
        throw new ApiError(400,"Error in booking the ticket")
    }
    user.visitedMuseum.push(museum._id)
    user.bookingId.push(newBooking._id)
    museum.bookings.push(newBooking._id)
    await museum.save();
    await user.save()


    return res.status(200).json(new ApiResponse(200, newBooking, "Booking of the ticket is successful"));
});
    export{
        numberOfSlotsAvailable,ticketGeneration,refreshSlots
    }