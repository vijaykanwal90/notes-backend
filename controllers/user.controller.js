import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async(req,res)=>{
  console.log("register user called")
    let {name, email, password} = req.body;
     if (!name || !email || !password) {
      console.error(" Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    email = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if(existingUser){
        console.error("Registration failed: User already exists");
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
  { id: savedUser._id, email: savedUser.email, name: savedUser.name },
  "ScriptGuru@123",
  { expiresIn: "7d" }
);


    const { password: _, ...userData } = savedUser.toObject();

    console.log(" User registered successfully:", userData);

    return res.status(201).json({
      message: "User created successfully",
      token,
      data: userData,
    });
}
const loginUser = async(req,res)=>{
  console.log("login user called")
      const {email, password} = req.body;
      try{
        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
            }
        console.log(email, password)
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ message: "User does not exist" });
        }
        console.log(user)
const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
  { id: user._id, email: user.email, name: user.name },
  "ScriptGuru@123",
  { expiresIn: "7d" }
);


    const { password: _, ...userData } = user.toObject(); // exclude password from returned data

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      data: userData,
    });
      }
      catch(error){
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
      }
}
const logoutUser = async(req,res)=>{
try {
   
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}
export {registerUser, loginUser, logoutUser};