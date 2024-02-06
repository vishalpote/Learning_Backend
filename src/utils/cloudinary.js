import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dr94rbjqn', 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadfilecloudinary=async (localfilepath)=>{
    try {
        if(!localfilepath) return null;

        const res=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })

        console.log("File uploaded successfully On Cloudinary...!!",res);
        return res;
        
    } catch (error) {
        // console.log("Error:"+error.message);
        fs.unlinkSync(localfilepath);
        return null;
    }
}


export {uploadfilecloudinary};


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });