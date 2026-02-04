const validateInput = (req, res, next) => {
  // Validate product creation/update
  if (req.body.name && typeof req.body.name !== 'string') {
    return res.status(400).json({ message: 'Invalid product name' });
  }
  
  if (req.body.price && (typeof req.body.price !== 'number' || req.body.price < 0)) {
    return res.status(400).json({ message: 'Invalid price' });
  }
  
  if (req.body.email && !isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  next();
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = validateInput;
