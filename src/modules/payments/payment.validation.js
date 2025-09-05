import joi from 'joi'

// Create payment validation schema
export const createPaymentSchema = {
    body: joi.object({
        userId: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'User ID must be a number',
                'number.integer': 'User ID must be an integer',
                'number.positive': 'User ID must be a positive number',
                'any.required': 'User ID is required'
            }),
        
        courseId: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Course ID must be a number',
                'number.integer': 'Course ID must be an integer',
                'number.positive': 'Course ID must be a positive number',
                'any.required': 'Course ID is required'
            }),
        
        amount: joi.number()
            .positive()
            .precision(2)
            .required()
            .messages({
                'number.base': 'Amount must be a number',
                'number.positive': 'Amount must be a positive number',
                'number.precision': 'Amount can have at most 2 decimal places',
                'any.required': 'Payment amount is required'
            })
    })
}

// Get payments validation schema (for query parameters)
export const getPaymentsSchema = {
    query: joi.object({
        userId: joi.number()
            .integer()
            .positive()
            .optional()
            .messages({
                'number.base': 'User ID must be a number',
                'number.integer': 'User ID must be an integer',
                'number.positive': 'User ID must be a positive number'
            })
    })
}

// Update payment status validation schema
export const updatePaymentStatusSchema = {
    params: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Payment ID must be a number',
                'number.integer': 'Payment ID must be an integer',
                'number.positive': 'Payment ID must be a positive number',
                'any.required': 'Payment ID is required'
            })
    }),
    
    body: joi.object({
        status: joi.string()
            .valid('pending', 'success')
            .required()
            .messages({
                'string.empty': 'Payment status is required',
                'any.only': 'Payment status must be either "pending" or "success"',
                'any.required': 'Payment status is required'
            })
    })
}