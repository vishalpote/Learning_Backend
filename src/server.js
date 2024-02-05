import express from 'express';
import dotenv from 'dotenv';
import connection from './database/datbase.js';

dotenv.config();

const app = express();
const port=process.env.PORT || 8000;

connection();

app.listen(port,()=>console.log(`port is running on ${port}`));