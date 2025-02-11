const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const constants = require('./../constants');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(" ")[1];
        if (!token) {
            res.status(constants.UNAUTHORIZED);
            throw new Error("User access token is missing");
        } else {
            jwt.verify(token, process.env.SECURITY_TOKEN, (err, matched) => {
                if (err) {
                    res.status(constants.UNAUTHORIZED);
                    throw new Error("User is not authorized!");
                }
                req.user = matched.user;
                next();
            })
        }
    }
});

module.exports = validateToken;