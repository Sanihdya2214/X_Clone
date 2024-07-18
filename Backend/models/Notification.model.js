import mongoose from "mongoose"


const NotificationSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    required: true,
    enum: ["follower", "likes"],
  },
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema)

export default Notification