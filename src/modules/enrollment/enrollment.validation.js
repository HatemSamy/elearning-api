
import joi from 'joi'
import { allowedEnrollmentModes } from '../../constants/enums.js'

export const enrollInCourseSchema = {
  params: joi.object({
    courseId: joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Course ID must be a number',
        'number.integer': 'Course ID must be an integer',
        'number.positive': 'Course ID must be a positive number',
        'any.required': 'Course ID is required'
      })
  }),

  body: joi.object({
    EnrollmentMode: joi.string()
      .valid(...allowedEnrollmentModes)
      .required()
      .messages({
        'any.only': `Enrollment type must be one of: ${allowedEnrollmentModes.join(', ')}`,
        'any.required': 'Enrollment type is required'
      })
  })
};

