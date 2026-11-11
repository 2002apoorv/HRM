const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/User');
const { Organization } = require('../models/Organization');
dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token not provided or malformed' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(decoded._id)
      .select('-password -__v')
      .populate('organizationId');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.organizationId) {
      return res.status(403).json({ success: false, message: 'User has no associated organization' });
    }

    req.user = user;
    // Derive organization from server authentication context, NEVER from client input
    req.organizationId = user.organizationId._id || user.organizationId;
    req.organization = user.organizationId;

    next();
  } catch (err) {
    console.error('Error verifying user:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized or expired session' });
  }
};

module.exports = verifyUser;