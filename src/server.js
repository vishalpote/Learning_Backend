import express from 'express';
import dotenv from 'dotenv';
import connection from './database/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port=process.env.PORT || 8000;


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());

connection();

app.listen(port,()=>console.log(`port is running on ${port}`));