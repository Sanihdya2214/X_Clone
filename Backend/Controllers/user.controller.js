import Notification from "../models/Notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    if (!user) res.status(404).json({ error: "No user found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followOrUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userTomodify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userTomodify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "User unfollowed Succesfully" });
    } else {
      //Follow
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
        //Send Notification
        
        const newNotification = new Notification({
             
            type: "follower",
            from: req.user._id,
            to:userTomodify._id,
            
  })
            await newNotification.save()

      res.status(200).json({ message: "User followed Succesfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const UsersFollowedByMe = await User.findById(userId)
    
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                },
        
            },

            {
                $sample: { size: 10 }
            }

        ])

        const filteredUsers = users.filter((user) => !UsersFollowedByMe.following.includes(user._id));
    
        const suggestedUsers = filteredUsers.slice(0, 4)
    
        suggestedUsers.forEach((user) => (user.password = null))
    
        res.status(200).json(suggestedUsers)
          
    }
    catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User Not Found" })
    
    
		if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        });
    }

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
    
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
    
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      } else {
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url;
      }
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
        else {
         const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url;
        }
    }
    
    user.name=name|| user.name
    user.username=username|| user.username
    user.email=email|| user.email
    user.bio=bio|| user.bio
    user.link=link|| user.link
    user.profileImg=profileImg|| user.profileImg
    user.coverImg=coverImg|| user.coverImg

    user = await user.save()
    
    user.password = null
    
    return res.status(200).json(user)


  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
  



}