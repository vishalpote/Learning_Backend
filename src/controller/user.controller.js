import User from "../models/user.model.js"
import { uploadfilecloudinary } from "../utils/cloudinary.js";

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