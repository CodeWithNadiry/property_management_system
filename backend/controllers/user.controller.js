import bcrypt from "bcryptjs";
import {
  createUserSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";

import {
  createUserService,
  deleteUserService,
  findUserByEmail,
  getUsersService,
  updateUserService,
} from "../services/user.services.js";
import User from "../models/user.model.js";

export async function createUser(req, res, next) {
  try {
    const { name, email, password, role, is_active } = req.body;
    const {property_id} = req.query;

    const adminAlreadyExist = await User.findOne({where: {role : 'admin', property_id}});
    if (adminAlreadyExist && role === 'admin') {
      return res.status(422).json({message: 'Admin already exist in this property'})
    }
    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    if (role === "superadmin") {
      return res.status(403).json({ message: "Cannot create superadmin" });
    }

    if (role === 'admin' && req.userRole)
    if (req.userRole === "admin" && role === "admin") {
      return res.status(403).json({ message: "Admin cannot create another admin" });
    }

    if (role === "staff" && !property_id) {
      return res.status(422).json({ message: "Staff must be assigned to a property" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(422).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createUserService({
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

export async function getUsers(req, res, next) {
  try {
    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    let filter = {};

    if (req.userRole === "admin") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const users = await getUsersService(filter);

    res.status(200).json({ users });
  } catch (error) {
    error.statusCode ||= 500;
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const value = req.body;
    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Access denied." });
    }

    const { id } = req.params;

    if (value.role === "superadmin") {
      return res.status(403).json({ message: "Cannot assign superadmin role" });
    }

    if (req.userRole === "admin" && value.role === "admin") {
      return res.status(403).json({ message: "Admin cannot assign admin role" });
    }

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 12);
    }

    const updatedUser = await updateUserService(id, value);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserService(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    error.statusCode ||= 500;
    next(error);
  }
}