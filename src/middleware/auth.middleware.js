import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT=async(req,res,next) => {
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",accessToken);
    
        if(!token){
            return res.status(401).json({message:"Unauthorized Request.."});
        }
    
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user=await User.findById(decoded?._id).select("-password -refreshToken");
        if(!user){
            return res.status(401).json({message:"Invalid Access Token"})
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid Access Token"});
    }
}