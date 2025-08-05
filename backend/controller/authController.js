const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

app.use(express.json());

const login= async (req, res) => {
    try{
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user=await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password',success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password',success: false });
        }

        const token = jwt.sign({_id:user._id,role:user.role },process.env.JWT_SECRET,{ expiresIn: '10d'}); 

        // If login is successful, you can return a success response
        res.status(200).json({ message: 'Login successful',success: true,token, user: { _id: user._id, name: user.name, role: user.role } });
    }
    catch(err){
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error hgjg' ,success: false});
    }
}

const verify = async (req, res) => {
    try {  
        return res.status(200).json({ success: true, user: req.user });
     }

    catch(err) {
        console.error('Error verifying user:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = {
  login,
  verify
}