import Lock from "../models/lock.model.js";
import Property from "../models/property.model.js";

export const createLockService = async (data) => {
  const { property_id } = data;

  const property = await Property.findByPk(property_id);
  if (!property) {
    throw new Error("Selected property does not exist");
  }

  const lock = await Lock.create(data);
  return lock;
};

export const findLockBySerial = (serial_number) =>
  Lock.findOne({ where: { serial_number } });

export const getLocksService = (filter = {}) =>
  Lock.findAll({ where: filter, order: [["created_at", "DESC"]] });

export const updateLockService = async (id, data) => {
  const lock = await Lock.findByPk(id);
  if (!lock) return null;

  // Optional: validate property_id on update
  if (data.property_id) {
    const property = await Property.findByPk(data.property_id);
    if (!property) throw new Error("Selected property does not exist");
  }

  await lock.update(data);
  return lock;
};

export const deleteLockService = async (id) => {
  const lock = await Lock.findByPk(id);
  if (!lock) return null;
  await lock.destroy();
  return lock;
};