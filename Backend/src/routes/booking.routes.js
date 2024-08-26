import Router from 'express';
import { numberOfSlotsAvailable, refreshSlots, ticketGeneration } from '../controllers/booking.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router=Router()
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
    try {
        await refreshSlots;
        console.log("Museum slots refreshed successfully at midnight");
    } catch (error) {
        console.error("Error refreshing museum slots:", error);
    }
});




router.route("/numberOfSlotsAvailable/:museumId").get(numberOfSlotsAvailable)
router.route("/ticketGeneration/:museumId").post(verifyJWT,ticketGeneration)
router.route("/refreshSlots").get(refreshSlots)
export default router