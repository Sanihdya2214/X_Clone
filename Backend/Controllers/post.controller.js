import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/Notification.model.js"
import cloudinary from "cloudinary"

export const createPost = async (req, res) => {
    try {
    
    const { text } = req.body
    let { img } = req.body
    
    const userId = req.user._id
    
    const user = await User.findById(userId)
    
    if (!user) return res.status(404).json({ message: "User Not Found" })
    if (!text && !img) {
        return res.status(400).json({ error: "Post must have text or image" });
    }
      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
      }
    const newPost = new Post({
        user: userId,
        img,
        text,
    })


    await newPost.save()

    return res.status(201).json(newPost);
}

    catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error);
    }

}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);

        if (post.user.toString() !== userId.toString()) {
          return res
            .status(401)
            .json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
          const imgId = post.img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

export const commentOnPost = async (req, res) => {
     
    try {
        const { text } = req.body;
        const { id } = req.params;
        const userId = req.user._id;

        if (!text) {
          res.status(404).json({ error: "Text field is Required" });
        }

        const post = await Post.findById( id );
        if (!post) {
          return res.status(404).json({ error: "Post Not Found" });
        }

        const comment = { user: userId, text };

         post.comments.push(comment);
        await post.save();
    
      res.status(200).json(post);
    } catch (error) {
        console.log("Error in commentOnPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    






}

export const likeUnlikePost = async (req, res) => {
    try {
         const { id: postId } = req.params;
         const userId = req.user._id;

         const post = await Post.findById(postId);

         if (!postId) {
           return res.status(404).json({ error: "Post not found" });
        }
        
        const isLiked = post.likes.includes(userId)
        
        if (isLiked) {
            //Unliked
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne(
              { _id: userId },
                { $pull: { likedPost: postId } }
            );
            
            const updateLikeds = post.likes.filter((id) => id.toString() !== userId.toString())
            
            res.status(200).json(updateLikeds)

        } else {
             post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPost: postId } })
            await post.save()
     
            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type:"likes"
            })
            await newNotification.save()
            
            const updateLiked = post.likes
            res.status(200).json(updateLiked)

        }


    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
   


}

export const getAllPosts = async (req, res) => {
            

    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select:"-password"
        })
            .populate({
                path: "comments.user",
                select:"-password"
        })    ; //populate function is used to give all the
        //Details of the user section in the post model

        if (posts.length===0) {
          res.status(200).json([]);
        }
            
        res.status(200).json(posts)
   
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    




};
export const getLikedPosts = async (req, res) => {
         const userId = req.params.id;
    
    try {
    const user = await User.findById(userId)
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }


    const LikedPosts = await Post.find({ _id: { $in: user.likedPost } })
        .populate({
            path: "user",
            select:"-password"
        })
        .populate({
            path: "comments.user",
            select:"-password"
        })
    
        res.status(200).json(LikedPosts)     


         } catch (error) {
            console.log("Error in getLikedPosts controller: ", error);
            res.status(500).json({ error: "Internal server error" });
         }
   

}

export const getFollowingPosts = async (req, res) => {
    
      try {
          const userId = req.user._id
          const user=await User.findById(userId)
          if (!user) {
              return res.status(404).json({error:"User Not Found"})
          }
          
          const following = user.following
          
          const FollowedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
              path: "user",
              select: "-password",
            })
            .populate({
              path: "comments.user",
              select: "-password",
            });
          res.status(200).json(FollowedPosts)
          
          
          
      } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
      }





}

export const getUserPosts = async (req, res) => {
         try {
              const { username } = req.params;

              const user = await User.findOne({ username });

              if (!user) {
                return res.status(404).json({ error: "User Not Found" });
              }

              const Posts = await Post.find({ user: user._id })
                .sort({ createdAt: -1 })
                .populate({
                  path: "user",
                  select: "-password",
                })
                .populate({
                  path: "comments.user",
                  select: "-password",
                });
             
             res.status(200).json(Posts)
              
         } catch (error) {
             console.log("Error in getUserPosts controller", error)
             res.status(500).json({error:"Internal Server Error"})
         }
  

}



       
    






