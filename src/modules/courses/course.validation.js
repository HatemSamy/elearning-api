import joi from 'joi'
import { allowedLocations, allowedLevels } from '../../constants/enums.js'

// Create course validation schema
export const createCourseSchema = {
    body: joi.object({
        name: joi.string()
            .min(3)
            .max(200)
            .required()
            .messages({
                'string.empty': 'Course name is required',
                'string.min': 'Course name must be at least 3 characters long',
                'string.max': 'Course name must not exceed 200 characters',
                'any.required': 'Course name is required'
            }),

        duration: joi.string()
            .required()
            .messages({
                'string.empty': 'Course duration is required',
                'any.required': 'Course duration is required'
            }),

        location: joi.alternatives()
      .try(
        joi.string(),
        joi.array().items(joi.string().valid(...allowedLocations))
      )
      .required()
      .custom((value, helpers) => {
        let parsed;

        if (typeof value === "string") {
          try {
            parsed = JSON.parse(value); 
            if (!Array.isArray(parsed)) {
              parsed = [parsed];
            }
          } catch {
            parsed = [value]; 
          }
        } else if (Array.isArray(value)) {
          parsed = value;
        }

        const invalid = parsed.filter((loc) => !allowedLocations.includes(loc));
        if (invalid.length) {
          return helpers.error("any.invalid", {
            message: `Invalid location(s): ${invalid.join(", ")}`,
          });
        }

        return parsed;
      })
      .messages({
        "any.required": "Course location is required",
        "any.invalid": "Invalid course location",
      }),


        startDate: joi.date()
            .iso()
            .required()
            .messages({
                'date.base': 'Start date must be a valid date',
                'date.format': 'Start date must be in ISO format',
                'any.required': 'Start date is required'
            }),

        endDate: joi.date()
            .iso()
            .greater(joi.ref('startDate'))
            .required()
            .messages({
                'date.base': 'End date must be a valid date',
                'date.format': 'End date must be in ISO format',
                'date.greater': 'End date must be after start date',
                'any.required': 'End date is required'
            }),

        fees: joi.string()
            .required()
            .messages({
                'string.empty': 'Course fees is required',
                'any.required': 'Course fees is required'
            }),

        language: joi.string()
            .required()
            .messages({
                'string.empty': 'Course language is required',
                'any.required': 'Course language is required'
            }),

        overview: joi.string()
            .max(5000)
            .optional()
            .messages({
                'string.max': 'Overview must not exceed 5000 characters'
            }),

        objectives: joi.alternatives()
            .try(
                joi.array().items(joi.string().min(1)).min(1),
                joi.string().custom((value, helpers) => {
                    try {
                        const parsed = JSON.parse(value);
                        if (!Array.isArray(parsed) || parsed.length === 0) {
                            return helpers.error('any.invalid');
                        }
                        return value;
                    } catch (error) {
                        return helpers.error('any.invalid');
                    }
                })
            )
            .required()
            .messages({
                'any.invalid': 'Objectives must be an array with at least one item or valid JSON string',
                'any.required': 'Course objectives are required'
            }),

        outcomes: joi.string()
            .max(5000)
            .optional()
            .messages({
                'string.max': 'Outcomes must not exceed 5000 characters'
            }),

        agenda: joi.alternatives()
            .try(
                joi.object(),
                joi.string().custom((value, helpers) => {
                    try {
                        JSON.parse(value);
                        return value;
                    } catch (error) {
                        return helpers.error('any.invalid');
                    }
                })
            )
            .optional()
            .messages({
                'any.invalid': 'Agenda must be a valid JSON object or JSON string'
            }),

        features: joi.alternatives()
            .try(
                joi.object(),
                joi.string().custom((value, helpers) => {
                    try {
                        JSON.parse(value);
                        return value;
                    } catch (error) {
                        return helpers.error('any.invalid');
                    }
                })
            )
            .optional()
            .messages({
                'any.invalid': 'Features must be a valid JSON object or JSON string'
            }),

        examination: joi.string()
            .optional()
            .messages({
                'string.base': 'Examination must be a string'
            }),

        accreditation: joi.string()
            .required()
            .messages({
                'string.empty': 'Accreditation is required',
                'any.required': 'Accreditation is required'
            }),

        paymentMethods: joi.alternatives()
            .try(
                joi.array().items(joi.string().min(1)).min(1),
                joi.string().custom((value, helpers) => {
                    try {
                        const parsed = JSON.parse(value);
                        if (!Array.isArray(parsed) || parsed.length === 0) {
                            return helpers.error('any.invalid');
                        }
                        return value;
                    } catch (error) {
                        return helpers.error('any.invalid');
                    }
                })
            )
            .required()
            .messages({
                'any.invalid': 'Payment methods must be an array with at least one item or valid JSON string',
                'any.required': 'Payment methods are required'
            }),

        instructorId: joi.number()
            .integer()
            .positive()
            .optional()
            .messages({
                'number.base': 'Instructor ID must be a number',
                'number.integer': 'Instructor ID must be an integer',
                'number.positive': 'Instructor ID must be a positive number'
            }),

        category: joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Course category is required',
                'string.min': 'Category must be at least 3 characters long',
                'string.max': 'Category must not exceed 100 characters',
                'any.required': 'Course category is required'
            }),

        level: joi.string()
            .valid(...allowedLevels)
            .required()
            .messages({
                'any.only': `Level must be one of: ${allowedLevels.join(', ')}`,
                'any.required': 'Course level is required'
            })
    })
}

// Get course by ID validation schema
export const getCourseByIdSchema = {
    params: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Course ID must be a number',
                'number.integer': 'Course ID must be an integer',
                'number.positive': 'Course ID must be a positive number',
                'any.required': 'Course ID is required'
            })
    })
}