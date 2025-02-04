import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
  
      user.refreshToken = refreshToken
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
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {  
      httpOnly: true,
      secure: true
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Successfully logged in",
        
        data: loggedInUser
      })


  } catch (error) {
    console.log('something went wrong', error)
    res.status(500).json({ message: "something went wrong"})
}
}

// this is about logout part and also need to verify token so other code in auth middlewarejs .

const userLogout = async (req, res) => {
   try {
     await User.findByIdAndUpdate(
         req.user._id,
         {
             $set: {
                 refreshToken : undefined
             }
         },
         {
             new: true
         })
     const options = {
         httpOnly: true,
         secure: true
     }
     return res
     .status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json ({
         message: "User Logged Out Successfully"
     })
   } catch (error) {
    console.log('error in logout',error.message)
    res.status(500).json({message: error.message})
   }
}

//  this is for fetching user data.
const getUser = async (req, res) => {
    try {
      res
        .status(200)
        .json({
          data: req.user,
          message: "User Fetched Data Successfully"
    })
    } catch (error) {
        console.log('error while fetching user',error.message)
        res.status(500).json({
            message: error.messsage
        })
    }
}


// this include refresh token which gives token to accesstoken.
const genRefreshToken = async(req, res) => {
    try {
        const token = req.cookies?.accessToken

        if(!token)
        {
            res.status(401).json({
                message: "Error while generating refreshtoken"
            })
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user", user)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          message: "Successfully Generates",
    })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}


export {userRegister, userLogin, userLogout, getUser, genRefreshToken}

 //extract refresh token
  //validate refresh token
  //decode refresh token -- extract id
  //find user 
  // generate access token 
  // set in cookie