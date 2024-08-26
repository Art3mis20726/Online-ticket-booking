import mongoose from "mongoose";
const museumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    location: {
        type: String,
        required: true
    },
    slots: {
        forenoon: {
            type: Number,
            required: true,
            default: 20
        },
        afternoon: {
            type: Number,
            required: true,
            default: 20
        }
    },
    bookings: [{date: {
        type: Date,
        required: true
    },
    forenoonVisitors: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        }
    ,
    afternoonVisitors: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        }}] // Array of daily bookings
});

export const Museum = mongoose.model("Museum", museumSchema);
