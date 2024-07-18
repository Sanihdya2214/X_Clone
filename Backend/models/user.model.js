import mongoose from "mongoose"


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers:[ {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: [],
    }
  ],
    following:[ {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: [],
    }
  ],
    bio: {
      type: String,
      default: "",
        },
        coverImg: {
            type: String,
            default:""
        },
        link: {
            type: String,
            default:""
    },
    likedPost:[ {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      default:[]
    }
  ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema)
 
export default User