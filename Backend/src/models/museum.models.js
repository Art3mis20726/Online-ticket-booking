import mongoose from "mongoose";
const museumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    initialSlots: {
        forenoon: {
            type: Number,
            required: true
        },
        afternoon: {
            type: Number,
            required: true
        }
    },
    weeklySlots: [
        {
            forenoon: {
                type: Number,
                required: true,
            },
            afternoon: {
                type: Number,
                required: true,
            }
        }
    ],
    bookings: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
    }]
});

export const Museum = mongoose.model("Museum", museumSchema);
