import express from 'express';
import { userController } from '../controller/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router=express.Router();

router.post('/register',upload.fields([
    {
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }
]),userController)

export default router;