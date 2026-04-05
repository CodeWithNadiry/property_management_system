import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const createSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { role: "superadmin" }
    });

    if (existingAdmin) {
      console.log("Super admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      12
    );

    await User.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
      is_active: true,
    });

    console.log("Super admin created successfully");
  } catch (err) {
    console.error("Error creating super admin:", err.message);
  }
};