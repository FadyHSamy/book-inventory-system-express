// src/controllers/UserController.ts
import { Request, Response } from "express";
import { generateToken } from "../config/jwt";

const User = require("../models/user");
const bcrypt = require("bcrypt");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, username, password, phoneNumber } = req.body;

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ error: "User Name is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let object = {
      firstName: firstName,
      username: username,
      password: password,
      phoneNumber: phoneNumber,
      hashedPassword: hashedPassword,
      salt: salt,
    };

    const newUser = new User({
      username: object.username,
      firstName: firstName,
      password: password,
      phoneNumber: phoneNumber,
      hashedPassword: object.hashedPassword,
      salt: object.salt,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      let validationErrors: any = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Assuming user is an object with properties salt and hashedPassword
    const storedHashedPassword: string = user.hashedPassword;
    const passwordMatch: boolean = await bcrypt.compare(password, storedHashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: { lastLoginDate: Date.now() } }, { new: true });

    const token = generateToken({
      username: updatedUser.username,
      userRole: updatedUser.userRole,
      status: updatedUser.status,
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error: any) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({ error: "Duplicate key error, username already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
