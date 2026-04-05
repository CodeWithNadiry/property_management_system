export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin" && req.userRole !== "superadmin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
};
