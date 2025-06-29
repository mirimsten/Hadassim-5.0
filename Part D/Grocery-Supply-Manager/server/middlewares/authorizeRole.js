// מידלוור לאימות הרשאות גישה למשתמשים
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }
  
  module.exports = authorizeRole;
  