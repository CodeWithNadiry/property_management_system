import User from "../models/user.model.js";

export const userService = {
  async createUser(data) {
    return User.create(data);
  },

  async getUsers(filter = {}) {
    return User.findAll({
      where: filter,
      order: [["created_at", "DESC"]],
    });
  },

  async getUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return user;
  },

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
  },

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  },

  async findUserByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async findAdminByProperty(property_id, role) {
    return await User.findOne({where: {role: 'admin', property_id}})
}
}