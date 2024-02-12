import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connection=async()=>{
    const database=process.env.MONGODB_URL

    //i use the mongodb compass here but if u want to use mongo db atlas cloud you can use
    // i also use mongo db atlas cloud
    // const database=process.env.MONGODB_URI

    try {
        //this is for the mongodb atlas cloud
        //    await mongoose.connect(`${database}`);
           //and this is for the mongodb compass
           await mongoose.connect(`${database}/youtube`);
           console.log("Mongo DB Connected Succesfully..!!");
    } catch (error) {
        console.log("Error While Connecting..!!"+error.message)
    }

    
}

export default connection;