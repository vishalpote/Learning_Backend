import User from "../models/user.model.js"
import { uploadfilecloudinary } from "../utils/cloudinary.js";


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