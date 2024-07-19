import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongoConnect.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./Routes/auth.routes.js";
import userRoutes from "./Routes/user.routes.js"
import postRoutes from "./Routes/post.routes.js"
import notificationRoutes from "./Routes/notification.routes.js"

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const Port = process.env.PORT || 5000;

app.use(express.json()); //To parse json data into req.body
app.use(express.urlencoded({ extended: false })); //To pass form data into req.body
app.use(cookieParser()); //Get the cookie from the request and then get the response cookie

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notifications", notificationRoutes);



app.get("/", (req, res) => {
  res.send("This us my threads");
});

app.listen(Port, () => {
  console.log(`The server is running on the port: ${Port}`);
  connectDB();
});
