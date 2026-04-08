import { propertyService } from "../services/property.services.js";
import {  updatePropertySchema } from "../schemas/property.schema.js";

export async function create(req, res, next) {
  try {
    const value = req.body;
    const property = await propertyService.create(value);

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    let filter = {};
    if (req.userRole === "staff") filter.id = req.userPropertyId;

    const properties = await propertyService.getAll(filter);
    res.status(200).json({ properties });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    const property = await propertyService.getOne(id);

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ property });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;

    if (req.userRole === "staff") return res.status(403).json({ message: "Not allowed" });

    const { error, value } = updatePropertySchema.validate(req.body, { abortEarly: true });
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 422;
      return next(err);
    }

    const updatedProperty = await propertyService.update(id, value);
    if (!updatedProperty) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    if (req.userRole !== "superadmin") return res.status(403).json({ message: "Only superadmin allowed" });

    const { id } = req.params;
    const deletedProperty = await propertyService.delete(id);

    if (!deletedProperty) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}