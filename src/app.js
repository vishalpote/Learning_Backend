import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js'


dotenv.config();
const app = express();
;

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/users',userRouter);


export {app};