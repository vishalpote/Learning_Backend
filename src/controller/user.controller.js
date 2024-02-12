import User from "../models/user.model.js"
import { uploadfilecloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken';
import {options} from '../utils/options.js'
import dotenv from 'dotenv';
import { upload } from "../middleware/multer.middleware.js";


dotenv.config();
const generateaccessandrefreshtoken=async(userId)=>{
        try {
                const user=await User.findById(userId);
                const accessToken=await user.generateAccessToken();
                const refreshToken=await user.generateRefreshToken();

                user.refreshToken=refreshToken;
                await user.save({ validateBefore :false });

                return {accessToken,refreshToken};
        } catch (error) {
                console.log("Something Went Wrong While Generetaing Access And Refresh Token...",error);
        }
}

export const userController=async(req,res)=>{
   const {username,email,fullname,password}=req.body;
   if(!username || !email || !fullname || !password){
        res.status(409).json({message:"Please Enter All The Fileds"});
   }

   const existed=await User.findOne({$or:[{username},{email}]})
   if(existed){
        res.status(400).json({message:"Username And Email Already Exist.."});
   }

   const avatarlocalPath=req.files?.avatar[0]?.path;
   const coverImageLocalpath=req.files?.coverImage[0]?.path;

   if(!avatarlocalPath){
           res.status(400).json({message:"Avatar Image Is Required"});
   }

   const avatar=await uploadfilecloudinary(avatarlocalPath);
   const coverImage=await uploadfilecloudinary(coverImageLocalpath);

   if(!avatar){
           res.status(400).json({message:"Avatar Is Required"});
   }

   const user=User.create({
     username:username.toLowerCase(),
     email,
     password,
     avatar:avatar.url,
     coverImage:coverImage?.url || "",
     fullname
   })

   const createdUser=await User.findById(user._id).select("-password -refreshToken")

   if(createdUser){
       //     res.status(201).json(new apiResopnes(200,createdUser,"User Register Succesfully"));
              res.status(200).json({message:"User Register Succesfully",data:createdUser});
       }
        res.status(500).json({message:"Something Went To Wrong"});

}


export const loginController=async(req,res)=>{
        // 1] req.body->data
        // 2] username and email
        // 3] find in database
        // 4] check password
        // 5] generate access token and refresh token
        // 6] send access token and refresh token to secured cookies

        const {username,email,password}=req.body;

        if(!username && !email){
                return res.status(400).json({message:"Username Or Email Is Required..!!"});
        }

        const user=await User.findOne({
                $or:[{username},{email}]
        })

        if(!user){
                return res.status(404).json({message :"User Not Found In Database"});
        }

        try {
                const passwordvalid=await user.checkPassword(password);
                if(!passwordvalid){
                        return res.status(401).json({message :"Password Does Not Match..!!"});
                }
        } catch (error) {
               return res.status(500).json({message :"Internal Server Error"});
        }

        const {accessToken,refreshToken}=await generateaccessandrefreshtoken(user._id);


        const LoggedUser=await User.findById(user._id).select("-password -refreshToken");
        const options={
                httpOnly:true,
                secure:true
        }

        return  res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({message:"User Logged In Successfully..",user:LoggedUser,accessToken,refreshToken})



}


export const logoutController=async(req,res)=>{
        await User.findByIdAndUpdate(
                req.user._id,
                {
                        $set:{
                                refreshToken:undefined
                        }
                },{
                        new:true
                }
        )

        const options={
                httpOnly:true,
                secure:true
        }

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json({message:"User Logged Out successfully..."})
}


export const refreshAccessToken=async(req,res)=>{

        const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken){
                return res.status(401).json({message:"Unauthorized Request...!! "})
        }

       try {
         const decodeToken=jwt.verify(incomingRefreshToken,process.env.vishalbhausahebpote90904545);
 
         const user=User.findById(decodeToken?._id)
         if(!user){
                 return res.status(401).json({message:"Invalid RefreshToken..."});
         }
 
         if(incomingRefreshToken !== user.refreshToken){
                 return res.status(401).json({message:"RefreshToken Expired Or Used!!"});
         }
 
         const {accessToken,newRefreshToken} = await generateaccessandrefreshtoken(user._id);
 
         return res
         .status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",newRefreshToken,options)
         .json({message:"Token Refreshed...",accessToken,refreshToken:newRefreshToken})
       } catch (error) {
                return res.status(500).json({message:"Internal Server Error",error});
       }
}

export const changecurrentPassword=async (req, res) => {

        const {oldPassword,newPassword}=req.body;
        const user=await User.findById(req.user._id)
        const ispasswordcorrect=await user.checkPassword(oldPassword);

        if(!ispasswordcorrect){
                return res.status(401).json({message:"Password Does Not Match..!!"});
        }

        user.password=newPassword;
        await user.save({validateBeforeSave:false}); 

        return res.status(200).json({message:"password Change Succesfully..!!"});
}


export const getCurrentUser=async(req,res)=>{
        return res
        .status(200)
        .json({message:"Current User Data Fetched Successfully...",data:req.user})
}

export const updateAccountDetails=async(req,res)=>{
        const { fullname,email }=req.body;

        if(!fullname || !email ){
                return res.status(400).json({message:"All Fields Are Required.."});
        }

        const user=await User.findByIdAndUpdate(
                req.user._id,
                {$set:{
                        fullname:fullname,
                        email:email
                }},
                {new:true}
        ).select("-password");
        return res
        .status(200)
        .json({message:"Account Updated Successfully..",data:user})
}

export const updateUserAvatar=async(req,res)=>{
        const avatarLocalPath=req.file?.path;

        if(!avatarLocalPath){
                return res.status(400).json({message:"Avatar File Is Missing.."});
        }

        const avatar=uploadfilecloudinary(avatarLocalPath);

        if(!avatar.url){
                return res.status(400).json({message:"Error While Uploading Avatar File.."});
        }

        const user=await User.findByIdAndUpdate(
                req.user._id,
                {
                        $set:{
                                avatar: avatar.url
                        }
                },
                {
                   new: true,
                }
        ).select("-password")

        return res.status(200).json({message:"Avatar Updated Successfully..",data:user})

}

export const updateUsercoverImage=async(req,res)=>{
        const coverImageLocalpath=req.file?.path;

        if(!coverImageLocalpath){
                return res.status(400).json({message:"CoverImage Is Missing.."});
        }

        const coverImage=uploadfilecloudinary(coverImageLocalpath);

        if(!coverImage.url){
                return res.status(400).json({message:"Error While CoverImage Uploaded.."});
        }

        const user=await User.findByIdAndUpdate(
                req.user._id,
                {
                        $set:{
                                coverImage: coverImage.url
                        }
                },
                {
                        new:true
                }
        )
        return res.status(200).json({message:"CoverImage Updated Successfully..",data:user})
}