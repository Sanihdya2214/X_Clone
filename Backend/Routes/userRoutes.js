import express from "express"
import { Signup,Login, Logout } from "../Controllers/UserControllers.js"
import { getme } from "../Controllers/UserControllers.js";
import ProtectRoute from "../middleware/ProtectRoute.js"; 
const router = express.Router()

router.get("/me", ProtectRoute, getme);
router.post("/signup", Signup)
router.post("/login",Login)
router.post("/logout",Logout)


export default router