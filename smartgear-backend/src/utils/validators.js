import Joi from 'joi'

// Product validation schema
export const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 2 characters',
        'string.max': 'Product name cannot exceed 200 characters'
      }),

    description: Joi.string()
      .trim()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.empty': 'Product description is required',
        'string.min': 'Product description must be at least 10 characters',
        'string.max': 'Product description cannot exceed 1000 characters'
      }),

    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Product price is required'
      }),

    currency: Joi.string()
      .valid('GHS', 'USD', 'EUR')
      .default('GHS')
      .uppercase(),

    category: Joi.string()
      .valid('smartphones', 'laptops', 'audio', 'tablets', 'wearables')
      .required()
      .lowercase()
      .messages({
        'any.only': 'Category must be one of: smartphones, laptops, audio, tablets, wearables',
        'any.required': 'Product category is required'
      }),

    image: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'Please provide a valid image URL',
        'any.required': 'Product image URL is required'
      }),

    specs: Joi.array()
      .items(
        Joi.string()
          .trim()
          .max(200)
          .messages({
            'string.max': 'Each spec cannot exceed 200 characters'
          })
      )
      .default([]),

    inStock: Joi.boolean().default(true),

    stockQuantity: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.min': 'Stock quantity cannot be negative',
        'number.integer': 'Stock quantity must be a whole number'
      }),

    featured: Joi.boolean().default(false),

    ratings: Joi.object({
      average: Joi.number().min(0).max(5).default(0),
      count: Joi.number().integer().min(0).default(0)
    }).default({ average: 0, count: 0 })
  })

  return schema.validate(product, { abortEarly: false })
}

// Customer details validation for checkout
export const validateCustomerDetails = (customer) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Full name is required',
        'string.min': 'Full name must be at least 2 characters',
        'string.max': 'Full name cannot exceed 100 characters'
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
      }),

    phone: Joi.string()
      .pattern(/^(\+233|0)[0-9]{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid Ghana phone number (e.g., 0241234567)',
        'any.required': 'Phone number is required'
      })
  })

  return schema.validate(customer, { abortEarly: false })
}

// Payment initialization validation
export const validatePaymentInit = (payment) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('GHS', 'USD', 'EUR').default('GHS'),
    productId: Joi.string().when('cartItems', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    cartItems: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).optional(),
    customerName: Joi.string().trim().min(2).required(),
    phone: Joi.string().required(),
    reference: Joi.string().optional(),
    callback_url: Joi.string().uri().optional(),
    metadata: Joi.object().optional(),
    channels: Joi.array().items(Joi.string()).optional()
  })

  return schema.validate(payment, { abortEarly: false })
}

// User registration validation
export const validateUserRegistration = (user) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Full name is required',
        'string.min': 'Full name must be at least 2 characters',
        'string.max': 'Full name cannot exceed 100 characters'
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
      }),

    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      }),

    phone: Joi.string()
      .pattern(/^(\+233|0)[0-9]{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid Ghana phone number (e.g., 0241234567)',
        'any.required': 'Phone number is required'
      })
  })

  return schema.validate(user, { abortEarly: false })
}

// User login validation
export const validateUserLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
      }),

    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })

  return schema.validate(user, { abortEarly: false })
}

// Password change validation
export const validatePasswordChange = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),

    newPassword: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters',
        'string.max': 'New password cannot exceed 128 characters',
        'any.required': 'New password is required'
      }),

    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'New passwords do not match',
        'any.required': 'New password confirmation is required'
      })
  })

  return schema.validate(data, { abortEarly: false })
}

// Cart item validation
export const validateCartItem = (item) => {
  const schema = Joi.object({
    productId: Joi.string()
      .required()
      .messages({
        'any.required': 'Product ID is required',
        'string.empty': 'Product ID cannot be empty'
      }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(1)
      .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be a whole number',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Maximum quantity per item is 10'
      })
  })

  return schema.validate(item, { abortEarly: false })
}

// Cart update validation
export const validateCartUpdate = (data) => {
  const schema = Joi.object({
    quantity: Joi.number()
      .integer()
      .min(0)
      .max(10)
      .required()
      .messages({
        'any.required': 'Quantity is required',
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be a whole number',
        'number.min': 'Quantity must be 0 or greater',
        'number.max': 'Maximum quantity per item is 10'
      })
  })

  return schema.validate(data, { abortEarly: false })
}