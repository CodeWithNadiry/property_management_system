import Property from "../models/property.model.js";
import UnitGroup from "../models/unitGroup.model.js";

export const propertyService = {
  async create(data) {
    return Property.create(data);
  },

  async getAll(filter = {}) {
    return Property.findAll({
      where: filter,
      order: [["id", "ASC"]],
    });
  },

  async getOne(id) {
    const property = await Property.findByPk(id);
    if (!property) return null;
    return property;
  },

  async update(id, data) {
    const property = await Property.findByPk(id);
    if (!property) return null;

    await property.update(data);
    return property;
  },

  async delete(id) {
    const property = await Property.findByPk(id);
    if (!property) return null;

    const hasUnitGroups = await UnitGroup.count({ where: { property_id: id } });
    if (hasUnitGroups > 0) {
      throw new Error("Property has unit groups. Delete them first.");
    }

    await property.destroy();
    return property;
  },
};
