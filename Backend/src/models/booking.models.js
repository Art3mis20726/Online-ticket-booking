import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    museumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Museum",
        required: true
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    visitors: [
        {
            fullName: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            gender: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            }
        }
    ],
    slot: 
        {
                type: String,
                enum: ["forenoon", "afternoon"],
                required: true
        }
    ,
    tickets: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },}, {
    timestamps: true
});

// Export the Booking model
export const Booking = mongoose.model("Booking", bookingSchema);
