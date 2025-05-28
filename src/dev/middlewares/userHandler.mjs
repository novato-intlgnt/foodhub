export const assignRole = (role) => {
  return (req, res, next) => {
    req.body.role = role;
    next();
  };
};

