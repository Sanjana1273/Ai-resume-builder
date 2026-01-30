import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const genrateToken = () => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// controller for user registration
// POST : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if required fields are present
    if (!name || !email || !password) {
      return res.status(400).js({ message: "Missing required fields" });
    }
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).js({ message: "User already exists" });
    }

    // create new user
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    // return sucess message
    const token = genrateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for user login
// POST : /api/users/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invaild email or password" });
    }

    // check if password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "INvaild email or password" });
    }
    // return success message
    const token = genrateToken(user._id);
    user.password = undefined;

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for getting user by id
// Get: /api/user/data

export const getUserById = async (req, res) => {
  try {
    const userId = res.userId;
    // check if user exists
    const user = await User.findById(userId)
    if(!user){
       return res.status(404).json({message:'User not found'}) 
    }
    user.password = undefined;
    return res.status(200).json({user})
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
};
