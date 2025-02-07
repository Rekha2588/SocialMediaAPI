const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/userDetailsModel');
const constants = require('./../constants');

//Signup
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, dateOfBirth, phoneNumber } = req.body;
    if (!email || !password || !dateOfBirth || !phoneNumber) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await UserDetails.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("Email already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserDetails.create({ ...req.body, password: hashedPassword });
    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email,
            dob: user.dateOfBirth,
            phoneNumber: user.phoneNumber
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//Signin
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Email/Password fields are mandatory");
    }
    const user = await UserDetails.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.attempts >= process.env.MAX_ATTEMPTS && user.lockOutTime) {
        if (new Date().getTime() - user.lockOutTime < process.env.LOCKOUT_DURATION) {
            res.status(400);
            throw new Error("Account locked due to excessive login attempts");
        }
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        user.attempts += 1;
        if (user.attempts >= process.env.MAX_ATTEMPTS) {
            user.lockOutTime = new Date().getTime();
        }
        await user.save();
        res.status(400);
        throw new Error("Invalid password");
    }
    const accessToken = jwt.sign({
        user: {
            email: user.email,
            _id: user.id
        }
    }, process.env.SECURITY_TOKEN,
        { expiresIn: "5m" }
    );
    user.attempts = 0;
    user.lockOutTime = null;
    await user.save();
    res.status(200).json({
        email: user.email,
        token: accessToken
    });
});

//Update user details
const updateUser = asyncHandler(async (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }    
    if (req.params.id !== req.user._id) {
        res.status(403);
        throw new Error("You are not authorized to update other user's details");
    }
    Object.assign(user, req.body);
    const updatedUser = await UserDetails.findByIdAndUpdate(req.params.id, user, { new: true });
    res.status(200).json({
        _id: updatedUser.id,
        email: updatedUser.email,
        dob: updatedUser.dateOfBirth,
        phoneNumber: updatedUser.phoneNumber
    });
});

//Delete User Details
const deleteUser = asyncHandler(async (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (req.params.id !== req.user._id) {
        res.status(403);
        throw new Error("You are not authorized to delete other user's details");
    }
    await UserDetails.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: "User details deleted successfully"
    });
});

//Unlock user account
const unlockUserAccount = asyncHandler(async (req, res) => {
    const user = await UserDetails.findOne({ email: req.body.email }); 
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    user.attempts = 0;
    user.lockOutTime = null;
    await user.save();
    res.status(200).json({
        email: user.email,
        message: "Your account is unlocked and ready to use."
    });
});

const findUserById = asyncHandler(async (id) => {
    return await UserDetails.findById(id);    
});

module.exports = { registerUser, loginUser, updateUser, deleteUser, unlockUserAccount }