import joi from 'joi';

export const updateProfileSchema = {
  body: joi.object({
    username: joi.string()
      .min(3)
      .max(30)
      .optional()
      .messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters'
      }),

    firstName: joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.base': 'First name must be a string',
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters'
      }),

    lastName: joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.base': 'Last name must be a string',
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters'
      }),

    avatar: joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Avatar must be a valid URL'
      })
  })
};
