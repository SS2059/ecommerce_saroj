import { User } from "../model/user.model.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
  
      user.refresh_token = refreshToken
      user.save({ validateBeforeSave: false })
  
      return { accessToken, refreshToken }
    } catch (error) {
      console.log('Error generating token', error)
  
  }
  }

// This is about registration part.
const userRegister = async(req, res) => {
try {

    //accept data from client
    //check whether the user already exists
    //take file url
    //create user
    //remove the unnecessary fields from user and sent the response

    const {username, email, password} = req.body
 
const isExist = await User.findOne({email: email})
if (isExist)
{
    res.status(409).json({
        messaga: 'User already exists !'
    })
}

const photoUrl = `public/images/${req.file.filename}`

const user = await User.create({
    username,
    email,
    password,
    profile_pic: photoUrl
})

const createdUser = await User.findById(user._id).select("-password -refreshtoken")

if(!createdUser)
{
    res.status(500).json({
        message: 'Error occured while registering',
        data : createdUser
    })
}
return res.status(201).json({
    message: 'User Registered Successfully'
})


} catch (error) {
    console.log("error in registering:", error);
    res.status(500).json({
        message: "Something went wrong"
    })

}
}


// This is about login part.

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body
    if(!email) {
        return res.status(400).json({
            message: "Email is required"
        })
    }
    const user = await User.findOne({email})
    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    console.log('acs token', accessToken)
    console.log('ref token', refreshToken)
    
    const loggedInUser = await User.findById(user._id).select("-password -refresh_token")

    const options = {  
      httpOnly: true,
      secure: true
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options).
      json({
        message: "Successfully logged in",
        data: loggedInUser
      })


  } catch (error) {
    console.log('something went wrong', error)
    res.status(500).json({ message: "something went wrong"})
}
}
export {userRegister, userLogin}