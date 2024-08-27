import Router from 'express';
import { cancelTicket, isTicketAvailable, numberOfSlotsAvailable, refreshSlots, ticketGeneration } from '../controllers/booking.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
const router=Router()
import cron from "node-cron";
import { paymentMiddleware } from '../middlewares/payment.middlewares.js';

cron.schedule("0 0 * * *", async () => {
    try {
        await refreshSlots;
        console.log("Museum slots refreshed successfully at midnight");
    } catch (error) {
        console.error("Error refreshing museum slots:", error);
    }
});




router.route("/numberOfSlotsAvailable/:museumId").get(numberOfSlotsAvailable)
router.route("/ticketGeneration/:museumId").post(verifyJWT,paymentMiddleware,ticketGeneration)
router.route("/refreshSlots").get(refreshSlots)
router.route("/isTicketAvailable").get(isTicketAvailable);
router.route("/cancelTicket/:bookingId").get(verifyJWT,cancelTicket)
export default router