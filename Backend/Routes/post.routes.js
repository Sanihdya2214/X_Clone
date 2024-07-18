import express from "express";
import ProtectRoute from "../middleware/ProtectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../Controllers/post.controller.js";

const router = express.Router();

router.get("/all", ProtectRoute, getAllPosts);
router.get("/following", ProtectRoute, getFollowingPosts);
 router.get("/likes/:id", ProtectRoute, getLikedPosts);
router.get("/user/:username", ProtectRoute, getUserPosts);
router.post("/create", ProtectRoute, createPost);
router.post("/like/:id", ProtectRoute, likeUnlikePost);
router.post("/comment/:id", ProtectRoute, commentOnPost);
router.delete("/:id", ProtectRoute, deletePost);


export default router