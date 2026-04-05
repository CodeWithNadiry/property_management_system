import User from "../models/user.model.js";

export const findUserByEmail = (email) => {
  return User.findOne({ where: { email } });
};

export const createUserService = (data) => {
  return User.create(data);
};

export const getUsersService = (filter = {}) => {
  return User.findAll({
    where: filter,
    order: [["created_at", "DESC"]],
  });
};

export const updateUserService = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.update(data);
  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.destroy();
  return user;
};