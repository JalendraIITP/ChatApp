import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateUserCoverImage,
    createChat,
    getChat,
    deleteGroup,
    removeMember,
    getConversations,
    getAll, addmessage
} from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser)
router.route('/').get((req, res) => {
    return res.send("The API is Connected!");
});
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh').post(refreshAccessToken)
router.route('/change').post(verifyJWT, changeCurrentPassword)
router.route('/currentUser').post(verifyJWT, getCurrentUser)
router.route('/updatedetails').patch(verifyJWT, updateAccountDetails)
router.route('/avatar').post(verifyJWT, upload.single('avatar'), updateAvatar)
router.route('/coverImage').post(verifyJWT, upload.single('coverImage'), updateUserCoverImage)
router.route('/createChat').post(verifyJWT, createChat);
router.route('/getChat').post(verifyJWT, getChat)
router.route('/deleteGroup').post(verifyJWT, deleteGroup)
router.route('/removeMember').post(verifyJWT, removeMember)
router.route('/getconversations').post(verifyJWT, getConversations)
router.route('/getall').get(verifyJWT, getAll)
router.route('/addmessage').post(verifyJWT, addmessage)
export default router