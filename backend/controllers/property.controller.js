import {
  createPropertySchema,
  updatePropertySchema,
} from "../schemas/property.schema.js";

import {
  createPropertyService,
  deletePropertyService,
  getPropertiesService,
  updatePropertyService,
} from "../services/property.services.js";

export async function createProperty(req, res, next) {
  try {
    const value = req.body;
    const property = await createPropertyService(value);

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getProperties(req, res, next) {
  try {
    let filter = {};

    if (req.userRole === "staff") {
      filter.id = req.userPropertyId;
    }

    const properties = await getPropertiesService(filter);

    res.status(200).json({
      properties,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const { id } = req.params;

    if (req.userRole === "staff") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { error, value } = updatePropertySchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 422;
      return next(err);
    }

    const updatedProperty = await updatePropertyService(id, value);

    if (!updatedProperty) {
      const error = new Error("Property not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    if (req.userRole !== "superadmin") {
      return res.status(403).json({ message: "Only super admin allowed" });
    }

    const { id } = req.params;

    const deletedProperty = await deletePropertyService(id);

    if (!deletedProperty) {
      const error = new Error("Property not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}