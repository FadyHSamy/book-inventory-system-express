const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("base64");
};

export const secretKey = generateSecretKey(); // Replace with your actual secret key

export const generateToken = (payload: any): string => {
  const expiresIn = "1h";
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};
