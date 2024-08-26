import Router from 'express';
import { registerMuseum } from '../controllers/museum.controllers.js';
const router=Router()
router.route("/registerMuseum").post(registerMuseum)
export default router