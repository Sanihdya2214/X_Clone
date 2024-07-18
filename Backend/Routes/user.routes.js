import express from "express"
import ProtectRoute from "../middleware/ProtectRoute.js"
import {
  followOrUnfollowUser,
  getSuggestedProfile,
  getUserProfile,
  updateUserProfile,
} from "../Controllers/user.controller.js";
const router =express.Router()


router.get("/profile/:username", getUserProfile)
 router.get("/suggested", ProtectRoute,getSuggestedProfile);
router.post("/follow/:id", ProtectRoute, followOrUnfollowUser)
 router.post("/update",ProtectRoute, updateUserProfile)

export default router
