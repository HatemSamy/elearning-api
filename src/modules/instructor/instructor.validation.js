import joi from 'joi';

export const createInstructorSchema = {
  body: joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone: joi.string().optional(),
    bio: joi.string().optional(),
    specialization: joi.string().optional(),
    social: joi.object().optional() 
  })
};