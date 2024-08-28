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
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + bookingDayIndex);

    const newBooking = await Booking.create({
        museumId,
        leaderId: user._id,
        visitors,
        slot,
        tickets,
        totalPrice:req.order?.amount,
        paymentId:orderId,
        bookingDate,
    });

    if(!newBooking){
        throw new ApiError(400,"Error in booking the ticket")
    }
    if(!user.visitedMuseum.includes(museumId)){
        user.visitedMuseum.push(museumId)
    }
    user.bookingId.push(newBooking._id)
    museum.bookings.push(newBooking._id)
    await museum.save();
    await user.save()


    return res.status(200).json(new ApiResponse(200, newBooking, "Booking of the ticket is successful"));
});
const isTicketAvailable=asyncHandler(async(req,res)=>{
    const {museumId,bookingDayIndex,slot,tickets}=req.query;
    if(!museumId){
        throw new ApiError(400,"Museum is not provided")
    }
    if(!bookingDayIndex){
        throw new ApiError(400,"Booking day is not provided")
    }
    if(!slot){
        throw new ApiError(400,"Slot is not provided")}
    if(!tickets){
        throw new ApiError(400,"Tickets are not provided")
    }
    if(!(bookingDayIndex>0||bookingDayIndex<6)){
        throw new ApiError(400,"Invalid booking day")
    }
    const museum=await Museum.findById(museumId)
    if(!museum){
        throw new ApiError(400,"Museum is not valid")
    }
    const availableSlots = museum.weeklySlots[bookingDayIndex][slot];
    if (availableSlots < tickets) {
        return res.status(200).json(new ApiResponse(200,false,'Ticket is not available'))}
    else{
        return res.status(200).json(new ApiResponse(200,true,'Ticket is available'))
    }

})
const cancelTicket = asyncHandler(async (req, res) => {
    const{bookingId}=req.params
    if (!bookingId) {
        throw new ApiError(400, "Booking id is not provided");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(400, "Booking is not valid");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(400, "User is not valid");
    }

    const museum = await Museum.findById(booking.museumId);
    if (!museum) {
        throw new ApiError(400, "Museum is not valid");
    }
    const createdAt = booking.bookingDate;
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate - createdAt);
    const bookingDayIndex = Math.floor(timeDiff / (1000 * 3600 * 24))+1; // Convert to days    
    if (bookingDayIndex < 0 || bookingDayIndex >= museum.weeklySlots.length) {
        throw new ApiError(400, "Invalid booking day index calculated");
    }
    museum.weeklySlots[bookingDayIndex][booking.slot] += booking.tickets;

    museum.bookings = museum.bookings.filter(id => !id.equals(bookingId));

    user.visitedMuseum = user.visitedMuseum.filter(id => !id.equals(museum._id));

    user.bookingId = user.bookingId.filter(id => !id.equals(bookingId));
    //or there is also on which i can use
    //  user.bookingId.pull(booking._id);
    //user.visitedMuseum.pull(museum._id);
    //museum.bookings.pull(booking._id);

    await museum.save();
    await user.save();
    await booking.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Booking canceled successfully"));
});


    export{
        numberOfSlotsAvailable,ticketGeneration,refreshSlots,isTicketAvailable,cancelTicket
    }