import joi from 'joi'

// Create course validation schema
export const createCourseSchema = {
    body: joi.object({
        
        title: joi.string()
            .min(3)
            .max(200)
            .required()
            .messages({
                'string.empty': 'Course title is required',
                'string.min': 'Course title must be at least 3 characters long',
                'string.max': 'Course title must not exceed 200 characters',
                'any.required': 'Course title is required'
            }),
        
        description: joi.string()
            .min(10)
            .max(2000)
            .required()
            .messages({
                'string.empty': 'Course description is required',
                'string.min': 'Course description must be at least 10 characters long',
                'string.max': 'Course description must not exceed 2000 characters',
                'any.required': 'Course description is required'
            }),
        
        price: joi.number()
            .positive()
            .precision(2)
            .required()
            .messages({
                'number.base': 'Price must be a number',
                'number.positive': 'Price must be a positive number',
                'number.precision': 'Price can have at most 2 decimal places',
                'any.required': 'Course price is required'
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