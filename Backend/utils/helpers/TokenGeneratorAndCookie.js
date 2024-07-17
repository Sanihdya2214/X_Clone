import jwt from "jsonwebtoken"

const TokenGenerator = (userId, res) => { 

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
       expiresIn:"15d"
   });

    res.cookie("jwt", token, {
        httpOnly: true,//This cookie cannot be  accesed by the browser
        maxAge: 15 * 24 * 60 * 60 * 1000,//15 days
        sameSite:"strict"// CSRF attacks se bachata hai 
      })
  return token
}

export default TokenGenerator
