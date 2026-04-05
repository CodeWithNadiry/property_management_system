import User from "../models/user.model.js";

export async function findUserByEmail(email) {
  return await User.findOne({where: {email}})
}