const { User } = require('../models/User');
const { Organization } = require('../models/Organization');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', success: false });
    }

    const trimmedInput = (email || '').trim();
    const query = {
      $or: [
        { email: trimmedInput },
        { email: trimmedInput.toLowerCase() },
        { email: trimmedInput.toLowerCase() === 'admin' ? 'admin@gmail.com' : trimmedInput },
        { name: trimmedInput },
      ],
    };

    const user = await User.findOne(query).populate('organizationId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password', success: false });
    }

    const org = user.organizationId;
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        organizationId: org ? org._id : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: org
          ? {
              _id: org._id,
              name: org.name,
              code: org.code,
              slug: org.slug,
              currency: org.currency || 'USD',
            }
          : null,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

const register = async (req, res) => {
  try {
    const { organizationName, name, email, password } = req.body;

    if (!organizationName || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Organization name, user name, email, and password are required',
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 5 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Generate unique slug for organization
    let baseSlug = organizationName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'org';
    let slug = baseSlug;
    let counter = 1;
    while (await Organization.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const orgCode = `ORG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrg = new Organization({
      name: organizationName.trim(),
      slug,
      code: orgCode,
      currency: 'USD',
      taxRate: 5,
      status: 'active',
    });
    await newOrg.save();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      organizationId: newOrg._id,
    });
    await newUser.save();

    newOrg.owner = newUser._id;
    await newOrg.save();

    const token = jwt.sign(
      {
        _id: newUser._id,
        role: newUser.role,
        organizationId: newOrg._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Organization and administrator account registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: {
          _id: newOrg._id,
          name: newOrg.name,
          code: newOrg.code,
          slug: newOrg.slug,
          currency: newOrg.currency,
        },
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to register organization and user',
    });
  }
};

const verify = async (req, res) => {
  try {
    const user = req.user;
    const org = req.organization;
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        organization: org
          ? {
              _id: org._id,
              name: org.name,
              code: org.code,
              slug: org.slug,
              currency: org.currency || 'USD',
              taxRate: org.taxRate || 5,
            }
          : null,
      },
    });
  } catch (err) {
    console.error('Error verifying user:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

module.exports = {
  login,
  register,
  verify,
};