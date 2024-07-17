import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/mongoConnect.js";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
const Port = process.env.PORT || 5000;

app.use(express.json()); //To parse json data into req.body
app.use(express.urlencoded({ extended: false })); //To pass form data into req.body
app.use(cookieParser()); //Get the cookie from the request and then get the response cookie

//Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("This us my threads");
});

app.listen(Port, () => {
  console.log(`The server is running on the port: ${Port}`);
});
