export const assignRole = (role) => {
  return (req, res, next) => {
    req.body.role = role;
    next();
  };
}

export const requireStall = (req, res, next) => {
  if (req.user.role !== 'stall') return res.status(403).json({ error: 'Forbidden' })
  next()
};

