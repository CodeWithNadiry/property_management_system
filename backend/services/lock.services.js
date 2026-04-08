import Lock from "../models/lock.model.js";
import Property from "../models/property.model.js";
import { AppError, NotFoundError } from "../utils/AppError.js";

export const lockService = {
  async createLock(data) {
    const { property_id, serial_number } = data;

    const exists = await Lock.findOne({ where: { serial_number } });
    if (exists) throw new AppError("Serial already exists", 422);

    const property = await Property.findByPk(property_id);
    if (!property) {
      throw new NotFoundError("Selected property does not exist");
    }

    const lock = await Lock.create(data);
    return lock;
  },

  async getLocks(filter = {}) {
    return await Lock.findAll({
      where: filter,
      order: [["created_at", "DESC"]],
    });
  },

  async getLock(id) {
    const lock = await Lock.findByPk(id);
    if (!lock) throw new NotFoundError("Lock not found");
    return lock;
  },

  async updateLock(id, data) {
    const lock = await Lock.findByPk(id);
    if (!lock) throw new NotFoundError("Lock not found");

    if (data.property_id) {
      const property = await Property.findByPk(data.property_id);
      if (!property) {
        throw new NotFoundError("Selected property does not exist");
      }
    }

    await lock.update(data);
    return lock;
  },

  async deleteLock(id) {
    const lock = await Lock.findByPk(id);
    if (!lock) throw new NotFoundError("Lock not found");

    await lock.destroy();
    return lock;
  },
};
