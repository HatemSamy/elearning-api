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

    avatar: joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Avatar must be a valid URL'
      })
  })
};
