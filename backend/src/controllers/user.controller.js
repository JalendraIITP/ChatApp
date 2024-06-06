import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"
import { mongoose } from 'mongoose'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch {
        throw new ApiError(500, "Something went wrong")
    }
}
const getChats = async (user) => {
    const chats = await Chat.aggregate([
        {
            $match: {
                $or: [
                    { Creator: user._id },
                    { Friend: user._id }
                ]
            }
        },
        {
            $sort: {
                updatedAt: -1
            }
        }
    ]);
    return chats
}
const getConversation = async (userId, friendsId) => {
    userId = String(userId);
    friendsId = String(friendsId);

    const senderId = new mongoose.Types.ObjectId(userId);
    const receiverId = new mongoose.Types.ObjectId(friendsId);

    const chats = await Message.aggregate([
        {
            $match: {
                $or: [
                    { Sender: senderId, Receiver: receiverId },
                    { Sender: receiverId, Receiver: senderId }
                ]
            }
        },
        {
            $sort: {
                updatedAt: -1
            }
        }
    ]);

    return chats;
}
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists:username,email
    // check for image, check for avatar
    // upload them to cloudinary server
    // create user object = create entry in db
    // remove password from user object
    // check for user creation
    // return user object

    const { fullname, email, username, password } = req.body
    if ([fullname, email, username, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "All fields must not be empty");
    }
    const existingUser = await User.findOne({ $or: [{ email, username }] })
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    let coverImageLocalPath, avatarLocalPath

    if (req.files) {
        if (req.files.avatar && req.files.avatar.length > 0) avatarLocalPath = req.files.avatar[0].path;
        if (req.files.coverImage && req.files.coverImage.length > 0) coverImageLocalPath = req.files.coverImage[0].path;
    }

    //if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //if (!avatar) throw new ApiError(400, "Avatar file is required")
    const user = await User.create({
        fullname: fullname,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        username: username,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) throw new ApiError(500, "Something went wrong");

    return res.status(201).json(new ApiResponse(200, "User registered successfully"))
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)

    if ([email, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "All fields must not be empty");
    }

    const user = await User.findOne({ email })

    if (!user) throw new ApiError(404, "User not found")

    const isMatch = await user.isPasswordCorrect(password)

    if (!isMatch) throw new ApiError(401, "Invalid password")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        path: '/',
        expires: new Date(Date.now() + 1000 * 50 * 5000),
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    }
    res.
        status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new ApiResponse(200, "User Logged In", { user: loggedInUser, refreshToken: refreshToken, accessToken: accessToken })
        );
})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200, {
                message: "User Logged Out"
            }, "User Logged Out")
        );
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthenticated request");
        }
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Invalid Refresh Token")
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options).
            json(
                new ApiResponse(200, {
                    user: user, accessToken: accessToken, refreshToken: refreshToken
                }, "Access Token refreshed successfully")
            );
    } catch (err) {
        throw new ApiError(401, "Invalid Refresh Token")
    }
})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = user.isPasswordCorrect(oldPassword);
    if (!isMatch) throw new ApiError(400, "Invalid Password")
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200).json(new ApiResponse(200, req.user, "current user"))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fulname, email } = req.body;
    if (!fulname || !email) throw new ApiError(400, "Invalid")
    const user = await User.findByIdAndUpdate(
        req.user?._id, {
        $set: {
            fulname,
            email
        }
    }, { new: true }).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "Account details updated"))
})
const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Missing avatar path")

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) throw new ApiError(400, "Error uploading avatar");
    const user = await User.findByIdAndUpdate(
        req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }
    ).select("-password")
    return res.status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))
})
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path;

    if (!coverLocalPath) throw new ApiError(400, "Missing CoverImage path")

    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if (!coverImage?.url) throw new ApiError(400, "Error uploading CoverImage");
    const user = await User.findByIdAndUpdate(
        req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true }
    ).select("-password")
    return res.status(200)
        .json(new ApiResponse(200, user, "coverImage updated successfully"))
})
const createChat = asyncHandler(async (req, res, next) => {
    const { friendsId } = req.body
    const Creator = await User.findById(req.user?._id)
    if (!Creator) throw new ApiError(400, "Invalid")
    const userId = req.user?._id;
    const existingChat = await Chat.findOne({
        $or: [
            { Creator: userId, Friend: friendsId },
            { Creator: friendsId, Friend: userId }
        ]
    });
    if (existingChat) res.status(200).json(new ApiResponse(200, "Already Friend"))

    const chat = await Chat.create({
        Creator,
        Friend: friendsId,
    })
    if (!chat) throw new ApiError(500, "Something went wrong")
    await chat.save()
    return res.status(200).json(new ApiResponse(200, "Chat created successfully"))
})
const getChat = asyncHandler(async (req, res) => {
    const user = req.user
    return res.status(200).json(await getChats(user))
})
const deleteGroup = asyncHandler(async (req, res) => {
    const user = req.user
    const { ChatId } = req.body
    const chat = await Chat.findById(ChatId)
    if (!chat) throw new ApiError(404, "Chat not found")
    if (chat.Creator._id.toString() !== user._id.toString()) throw new ApiError(401, "Unauthorized")
    try {
        await Chat.findByIdAndDelete(ChatId)
        res.status(200).json(new ApiResponse(200, "Successfully Deleted"));
    } catch (e) {
        return res.status(200).json(new ApiResponse(200, e.message));
    }
})
const removeMember = asyncHandler(async (req, res) => {
    const user = req.user
    const { ChatId, MemberId } = req.body
    const chat = await Chat.findById(ChatId)
    if (!chat) throw new ApiError(404, "Chat not found")
    if (chat.Creator._id.toString() !== user._id.toString()) throw new ApiError(401, "Unauthorized")
    await Chat.findByIdAndUpdate(
        ChatId,
        { $pull: { Members: { user: MemberId } } }
    ).then(async () => {
        const chat = await Chat.findById(ChatId)
        if (chat.Members.length < 2) {
            await Chat.findByIdAndDelete(ChatId)
        }
        return res.status(200).json(new ApiResponse(200, "Successfully Removed"));
    }).catch((error) => {
        return res.status(200).json(new ApiResponse(200, error.message));
    })
})
const getConversations = asyncHandler(async (req, res) => {
    const user = req.user
    const { friendsId } = req.body
    return res.status(200).json(await getConversation(user._id, friendsId));
})
const getAll = asyncHandler(async (req, res) => {
    return res.status(200).json(await User.find({}))
})
const addmessage = asyncHandler(async (req, res) => {
    const { sender, receiver, message } = req.body;
    console.log(sender, receiver, message)
    if (!sender || !receiver || !message) throw new ApiError(400, "Invalid")
    const chat = await Message.create({
        Receiver: receiver,
        Sender: sender,
        Content: message
    })
    await chat.save()
    res.status(200).json("Message Sent")
})

export {
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
    getAll,
    addmessage
}