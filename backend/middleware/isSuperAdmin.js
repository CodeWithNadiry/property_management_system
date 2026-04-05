export const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== "superadmin") {
    return res.status(403).json({ message: "Only super admin allowed" });
  }

  next();
};