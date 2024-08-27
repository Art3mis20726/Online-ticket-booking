import Router from 'express';
import { isMuseumAvailable, registerMuseum } from '../controllers/museum.controllers.js';
const router=Router()
router.route("/registerMuseum").post(registerMuseum)
router.route("/isMuseumAvailable/:museumName").get(isMuseumAvailable)
export default router