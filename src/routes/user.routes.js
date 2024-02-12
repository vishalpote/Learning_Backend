import express from 'express';
import { loginController, logoutController, userController } from '../controller/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
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


router.post('/login',loginController);

router.post('/logout',verifyJWT,logoutController);
export default router;