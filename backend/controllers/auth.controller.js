import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../services/auth.services.js";

export async function login(req, res, next) {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    console.log("USER:", user);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isEqual);

    if (!isEqual) {
      const err = new Error("Incorrect password");
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        role: user.role,
        property_id: user.property_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    err.statusCode ||= 500;
    next(err);
  }
}