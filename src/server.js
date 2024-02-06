import { app } from './app.js';
import dotenv from 'dotenv';
import connection from './database/database.js';



dotenv.config();
const port=process.env.PORT || 8000




connection();

app.listen(port,()=>console.log(`port is running on ${port}`));