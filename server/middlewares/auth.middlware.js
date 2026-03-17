const asyncHandler = require("../utilities/asyncHandler.utility.js");
const errorHandler = require("../utilities/errorHandler.utility.js");
const jwt = require("jsonwebtoken")

const isAuthenticated = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token || req.headers['authorization']?.replace("Bearer ", "");
    if (!token) {
        return next(new errorHandler("Unauthorized", 401))
    }
    let tokenData;
    try {
        tokenData = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return next(new errorHandler("Unauthorized", 401))
    }
    req.user = tokenData
    next()
});


module.exports = isAuthenticated;