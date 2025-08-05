const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Adjust the path as necessary
const { User } = require('../models/User');
dotenv.config();

const verifyUser = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token not provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }


        const user = await User.findById({_id:decoded._id}).select('-password -__v'); // Exclude password and __v field
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch(err){
        console.error("Error verifying user:", err);
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}
module.exports = verifyUser;