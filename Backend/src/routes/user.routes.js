import { Router } from "express";
import { bookingDetails, getWebnAPP, loginUser, logoutUser, museumVisited, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router()
router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").get(verifyJWT,logoutUser)
router.route("/getAllVisitedMuseum").get(verifyJWT,museumVisited)
router.route("/getAllBookingDetails").get(verifyJWT,bookingDetails)
router.route("/getData/:userId").get(getWebnAPP)
export default router
