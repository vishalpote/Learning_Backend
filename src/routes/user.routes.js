import express from 'express';
import { changecurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginController,
     logoutController, refreshAccessToken, updateAccountDetails, 
     updateUserAvatar, updateUsercoverImage, userController } from '../controller/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router=express.Router();


//register route
router.post('/register',upload.fields([
    {
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }
]),userController)

//login route
router.post('/login',loginController);


//secured routes here
router.post('/logout',verifyJWT,logoutController);

//refresh token 
router.post('/refresh-Token',refreshAccessToken);

//change password of user 
router.post("/change-password",verifyJWT,changecurrentPassword);

//get current user information
router.get("/current-user",verifyJWT,getCurrentUser);

//update account details
router.patch("/update-account",verifyJWT,updateAccountDetails);

//update user avatar
router.patch("/update-avatar",verifyJWT,upload.single("avatar"),updateUserAvatar);

//update cover image
router.patch("/update-coverImage",verifyJWT,upload.single("coverImage"),updateUsercoverImage);

//getuserchannel profile
router.get("/channel/:username",verifyJWT,getUserChannelProfile);

//get watch history of user
router.get("/history",verifyJWT,getWatchHistory)
export default router;