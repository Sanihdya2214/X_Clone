import express from "express"
import ProtectRoute from "../middleware/ProtectRoute.js"
import {
  getNotifications,
  deleteNotifications,
} from "../Controllers/notification.controller.js";
const router = express.Router()


router.get("/", ProtectRoute, getNotifications)
router.delete("/", ProtectRoute, deleteNotifications);


export default router