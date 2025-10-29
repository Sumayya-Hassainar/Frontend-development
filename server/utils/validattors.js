const Joi = require('joi');

/**
 * User Registration Validation Schema
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain uppercase, lowercase and a number',
    }),
});

/**
 * User Login Validation Schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

/**
 * Note (Sample Entity) Validation Schema
 */
const noteSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 2 characters long',
  }),
  content: Joi.string().allow('').max(500).messages({
    'string.max': 'Content cannot exceed 500 characters',
  }),
  tags: Joi.array().items(Joi.string().trim()).default([]),
});

/**
 * Generic Validation Function
 */
function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return {
      valid: false,
      errors: error.details.map((err) => err.message),
    };
  }
  return { valid: true, value };
}

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  noteSchema,
};
