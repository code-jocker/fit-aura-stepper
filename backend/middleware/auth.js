const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid, we still proceed but without user info
    next();
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    const allowedRoles = ['super_admin', 'admin'];
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
  });
};

const superAdminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === 'super_admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Super Admin privileges required.' });
    }
  });
};

const staffAuth = (req, res, next) => {
  auth(req, res, () => {
    const allowedRoles = ['super_admin', 'admin', 'staff', 'support'];
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Staff privileges required.' });
    }
  });
};

module.exports = { auth, optionalAuth, adminAuth, superAdminAuth, staffAuth };
