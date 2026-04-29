const Joi = require('joi');

const validateProduct = (req, res, next) => {
  console.log('Raw images from request:', req.body.images, typeof req.body.images);
  
  // Filter out empty strings from images array before validation
  if (req.body.images !== undefined && req.body.images !== null) {
    // Ensure images is an array
    if (Array.isArray(req.body.images)) {
      req.body.images = req.body.images.filter(img => img && typeof img === 'string' && img.trim());
    } else if (typeof req.body.images === 'string' && req.body.images.trim()) {
      // Single image string - convert to array
      req.body.images = [req.body.images.trim()];
    } else {
      // Invalid format - set to empty array
      req.body.images = [];
    }
  } else {
    req.body.images = [];
  }
  
  console.log('Processed images:', req.body.images);
  
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Product name is required',
    }),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().allow('', null),
    audience: Joi.string().valid('men', 'women', 'kids', 'unisex').default('unisex'),
    price: Joi.number().min(0).required(),
    salePrice: Joi.number().min(0).allow(null, ''),
    description: Joi.string().required(),
    shortDescription: Joi.string().allow('', null),
    sku: Joi.string().allow('', null),
    tags: Joi.array().items(Joi.string()).default([]),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.string().min(1)).min(1),
      Joi.string().min(1)
    ).messages({
      'array.min': 'At least one product image is required',
      'string.min': 'Image URL cannot be empty',
    }),
    sizes: Joi.array().items(Joi.string()).default([]),
    colors: Joi.array().items(Joi.string()).default([]),
    stock: Joi.number().integer().min(0).default(0),
    lowStockThreshold: Joi.number().integer().min(0).default(5),
    weight: Joi.number().min(0).allow(null, ''),
    dimensions: Joi.object({
      length: Joi.number().min(0).allow(null, ''),
      width: Joi.number().min(0).allow(null, ''),
      height: Joi.number().min(0).allow(null, ''),
    }).default({}),
    isFeatured: Joi.boolean().default(false),
    isNew: Joi.boolean().default(true),
    isPublished: Joi.boolean().default(true),
    metaTitle: Joi.string().allow('', null),
    metaDescription: Joi.string().allow('', null),
    slug: Joi.string().allow('', null),
    status: Joi.string().valid('draft', 'published', 'out_of_stock').default('published'),
    variants: Joi.array().items(Joi.object()).default([]),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

const validateAuth = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
    }),
    name: Joi.string().when('$isRegister', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });

  const { error } = schema.validate(req.body, { 
    abortEarly: false,
    context: { isRegister: req.path.includes('register') }
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    subcategories: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      slug: Joi.string().allow('', null),
    })).default([]),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phone: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
    role: Joi.string().valid('admin', 'delivery', 'staff', 'support').default('delivery'),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

const validateCart = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    size: Joi.string().allow('', null),
    color: Joi.string().allow('', null),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

const validateOrderUpdate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').optional(),
    paymentStatus: Joi.string().valid('pending', 'completed', 'failed').optional(),
    deliveryAddress: Joi.string().optional(),
    phone: Joi.string().optional(),
    notes: Joi.string().allow('', null).optional(),
    deliveryPerson: Joi.string().allow('', null).optional(),
    assignedAt: Joi.date().optional(),
    adminNote: Joi.string().allow('', null).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
  }
  next();
};

module.exports = {
  validateProduct,
  validateAuth,
  validateCategory,
  validateUser,
  validateCart,
  validateOrderUpdate,
};
