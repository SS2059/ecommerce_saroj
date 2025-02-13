import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
  
      user.refresh_Token = refreshToken
      user.save({ validateBeforeSave: false })
  
      return { accessToken, refreshToken }
    } catch (error) {
      console.log('Error generating token', error)
  
  }
  }
  // const generateAccessToken = async(userId) => {
  //   try {
  //     const user = await User.findById(userId)
  //     const accessToken = user.generateAccessToken()

  //     return {accessToken}
  //   } catch (error) {
  //     console.log('Error generating access token', error)
  //   }
  // }

  // const generateRefreshToken = async(userId) => {
  //   try {
  //     const user = await User.findById(userId)
  //     const refreshToken = user.generateRefreshToken()

  //     user.refresh_Token = refreshToken
  //     user.save({validateBeforeSave: false})

  //     return {refreshToken}
  //   } catch (error) {
  //     console.log('Error generating refresh token', error)
      
  //   }
  // }
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


// this include refresh token which gives token to accesstoken for validation.

  //extract refresh token
  //validate refresh token
  //decode refresh token -- extract id
  //find user 
  // generate access token 
  // set in cookie

const refreshAccessToken = async (req, res) => {
  try {
    const fetchedRefToken = req.cookies?.refreshToken
    console.log("fetch ref", fetchedRefToken)


    if (!fetchedRefToken) {
      return res.status(401).json({
        message: "Unauthorized request"
      })
    }

    const decodedToken = jwt.verify(fetchedRefToken, process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      return res
      .status(401)
      .json({ message: "Invalid refresh token" })
    }
    console.log(user)
    console.log('user ref', user.refreshToken)

    if (fetchedRefToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Refresh token is expired"
      })
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Successfully generated access token"
      })


  } catch (error) {
    console.log("error in access token generation", error)
    res.status(500).json({
      error: error
    })
  }
}

// this is for updating user details.

export const updateUserDetails = async (req, res) => {
    try {
        const {username, email} = req.body

        if(!username || !email) {
            return res.status(400).json({
                messagae: 'All fields are required !'
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    username,
                    email
                }
            },
            {
                new : true
            }
        ).select("-password -refreshToken")

        return res.status(200).json({
            message: "User Updated Successfully"
        })

    } catch (error) {
        console.log('error while updating details', error)
        return res.status(500).json(error)
    }
}



//try catch ma rakhne
  //req old and new password, confPass from user
  //confirm old password
  //validation
  //fetch user  by id
  //update password
  //sent response

  // This is for updating password.
   const updatePassword = async(req,res) => {
    try {
      const {oldpassword, newpassword} = req.body
      
      const user = await User.findById(req.user?._id)
      if(!user){
        return res.status(404).json({
          message: "User not found"
        })
      }

      const isPasswordValid = await user.isPasswordCorrect(oldpassword)
      if(!isPasswordValid){
        return res.status(400).json({
          message: "Wrong password"
        })
      }
      user.password = newpassword
      user.save({validateBeforeSave: false})

      return res.status(200).json({
        message: "Password Updated Successfully"
      })

    } catch (error) {
      console.log("Error while updating password")
      return res.status(500).json({
        message: error.message
      })
    }
  }


  // This is for updating profile picture.

  const updateprofilepic = async (req, res) => {
    try {
      
      const currentpicture = req.file?.path
      
      if (!currentpicture){
        return res.status(400).json({
          message: "No file uploaded"
        })
     }
     const UpdatedPhoto = `public/images/${req.file.filename}`

     const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profile_pic: UpdatedPhoto
        }
      },
      {
        new: true
      }).select("-password -refreshToken")
      if (!user){
        return res.status(404).json({
          message: "User not found"
        })
      }
      return res.status(200).json({
        message: "New Profile Picture Updated Successfully"
      })
    } 
    catch (error) {
      console.log("Error updating profile picture", error)
      return res.status(500).json({
        message: "Failed to update the profile picture"
      })
    }
  }
  export {userRegister, userLogin, userLogout, getUser, refreshAccessToken, updatePassword, updateprofilepic} 

