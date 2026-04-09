import { authService } from "../services/auth.services.js";
import { AppError } from "../utils/AppError.js"; // must import AppError

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 422);
    }

    const user = await authService.findUserByEmail(email);
    await authService.comparePassword(password, user);

    const token = authService.generateToken(user);

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
}
