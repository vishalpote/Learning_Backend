import User from "../models/user.model.js"


export const userController=async(req,res)=>{
   const {username,email,fullname,password}=req.body;
   if(!username || !email || !fullname || !password){
        res.status(404).json({message:"Please Enter All The Fileds"});
   }

   const existed=User.findOne({$or:[{username},{email}]})
   if(existed){
        res.status(409).json({message:"Username And Email Already Exist.."});
   }
}