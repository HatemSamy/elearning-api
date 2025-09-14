import joi from 'joi'

// Add to cart validation schema
export const addToCartSchema = {
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
    })
}

// Remove from cart validation schema
export const removeFromCartSchema = {
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
    })
}

// Clear cart validation schema (no body needed)
export const clearCartSchema = {
    params: joi.object({})
}
