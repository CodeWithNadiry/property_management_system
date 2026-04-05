import Property from "../models/property.model.js";

export const createPropertyService = (data) => {
  return Property.create(data);
};

export const getPropertiesService = (filter = {}) => {
  return Property.findAll({
    where: filter,
    order: [["id", "ASC"]], // sorts them by id in ascending order
  });
};

export const updatePropertyService = async (id, data) => {
  const property = await Property.findByPk(id);
  if (!property) return null;

  await property.update(data);
  return property;
};

export const deletePropertyService = async (id) => {
  const property = await Property.findByPk(id);
  if (!property) return null;

  await property.destroy();
  return property;
};