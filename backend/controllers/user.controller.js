import bcrypt from "bcryptjs";
import { userService } from "../services/user.services.js";

export async function create(req, res, next) {
  try {
    const { name, email, password, role, is_active } = req.body;
    const { property_id } = req.query;

    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    if (role === "superadmin") {
      return res.status(403).json({ message: "Cannot create superadmin" });
    }

    if (req.userRole === "admin" && role === "admin") {
      return res.status(403).json({ message: "Admin cannot create another admin" });
    }

    if (role === "staff" && !property_id) {
      return res.status(422).json({ message: "Staff must be assigned to a property" });
    }

    if (role === "admin") {
      const adminAlreadyExist = await userService.findAdminByProperty(property_id);
      if (adminAlreadyExist) {
        return res.status(422).json({
          message: "Admin already exist in this property",
        });
      }
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(422).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      property_id: property_id || null,
      is_active: is_active ?? true,
    });

    res.status(201).json({ user });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    const filter = {};

    if (req.userRole === "admin") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const users = await userService.getUsers(filter);

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    const { id } = req.params;
    const value = req.body;

    if (value.role === "superadmin") {
      return res.status(403).json({ message: "Cannot assign superadmin role" });
    }

    if (req.userRole === "admin" && value.role === "admin") {
      return res.status(403).json({ message: "Admin cannot assign admin role" });
    }

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 12);
    }

    const updatedUser = await userService.updateUser(id, value);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
}