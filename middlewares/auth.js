const jwt = require("jsonwebtoken");
// const { secretKey } = require('../config')
const secretKey = "a4@801??983";

const authenticate = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ error: "Token is required" });
    try {
        const decoded = await jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
};

const authorize = (allowedUserTypes) => async (req, res, next) => {
    try {
        const { user } = req;
        if (allowedUserTypes.indexOf(user.userType) == -1) return res.status(403).json({ error: "User is not allowed" });
        next();
    } catch (error) {
        return res.status(403).json({ error });
    }
};

module.exports = {
    authenticate,
    authorize,
};
