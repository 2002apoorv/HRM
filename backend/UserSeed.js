const bcrypt = require('bcrypt');
const { User } = require('./models/User');
const connectToDatabase = require('./db/db.js');

const userRegister = async () => {
  try {
    await connectToDatabase(); // Ensure it's awaited

    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin user created successfully.");
  } catch (err) {
    console.error("Error in user registration:", err);
  }
};

userRegister();
