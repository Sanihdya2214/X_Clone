import { compare, genSalt, hash } from "bcrypt"
import User from "../models/user.model.js"
import TokenGenerator from "../utils/helpers/TokenGeneratorAndCookie.js"

export const Signup = async (req, res) => {
      
    try {
        const { name, username, email, password } = req.body
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }
        
       
		const existingUser = await User.findOne({ username });
    
        if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
        }
           
		const existingEmail = await User.findOne({ email });
       
        if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

        if (password.length < 6) {
          return res
            .status(400)
            .json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await genSalt(10)
        const hashPassword=await hash(password,salt)


        const newUser = new User({
            name,
            username,
            email,
           password:hashPassword,
          
})
        await newUser.save()
        
        if (newUser) {
            TokenGenerator(newUser._id,res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email:newUser.email,
                username: newUser.username,
                profilePic: newUser.profilePic,
                followers: newUser.followers,
                following: newUser.following,
                coverImg:newUser.coverImg
            })
        } else {
            res.status(400).json({message:"Invalid user Data"})
        }

     } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in signupUser:",error.message)
    }
    




}

export const Login = async (req, res) => {
    
    try {
        const { username, password } = req.body
        
        const user = await User.findOne({ username })
        
        const isPasswordCorrect = await compare(password, user?.password || "")
        if (!user || !isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" } )
        
        TokenGenerator(user._id, res)
        
        res.status(200).json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          followers: user.followers,
          following: user.following,
          coverImg: user.coverImg,
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in loginUser:", error.message)
    }



}

export const Logout = async (req, res) => {
    
    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(200).json({message:"User Logged out Successfully"})
    } catch (error) {
         res.status(500).json({ message: error.message });
         console.log("Error in logOut", error.message);
    }


}

export const getme = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
       res.status(200).json(user)
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}