import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

export const authService = {
  async findUserByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("User not found", 401);
    return user;
  },

  async comparePassword(password, user) {
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new AppError("Incorrect password", 401);
  },

  generateToken(user) {
    return jwt.sign(
      {
        email: user.email,
        userId: user.id,
        role: user.role,
        property_id: user.property_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  },
};