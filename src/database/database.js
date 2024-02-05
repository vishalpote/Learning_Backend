import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connection=async()=>{
    const database=process.env.MONGODB_URI

    try {
           await mongoose.connect(database);
           console.log("Mongo DB Connected Succesfully..!!");
    } catch (error) {
        console.log("Error While Connecting..!!"+error.message)
    }

    
}

export default connection;