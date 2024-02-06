import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
        lowercase:true
    },
      email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    avatar:{
        type:String,
        required:true,
    },
     coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password Is Required"]
    },
    refreshToken:{
        type:String,
    }
},{
    timestamps:true,
})


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=bcrypt.hash(this.password,10);
        next();
    }
})


userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
        return jwt.sign({
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
}


userSchema.methods.generateRefreshToken = function(){
        return jwt.sign({
            _id:this._id,
        },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )
}


const User=mongoose.model("User",userSchema);

export default User;