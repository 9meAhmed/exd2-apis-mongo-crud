require('dotenv').config();
var jwt = require('jsonwebtoken');

const authorize = () => {

    return (req, res, next) => {

        if(!req.headers.authorization) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        
        const token = req.headers.authorization.replace('Bearer ', '');

        try {
            var decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
            req.user = decoded; // Attach the decoded user info to the request object
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
}

module.exports = authorize;