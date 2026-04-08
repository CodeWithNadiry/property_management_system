import Property from "../models/property.model.js";
import UnitGroup from "../models/unitGroup.model.js";

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

  const hasUnitGroups = await UnitGroup.count({where: {property_id: id}})
  if (hasUnitGroups > 0) {
    throw new Error('Property has unit groups. first delete them.')
  }
  await property.destroy();
  return property;
};