import joi from 'joi'

// Create payment method validation schema
export const createPaymentMethodSchema = {
    body: joi.object({
        method: joi.string()
            .valid('visa', 'mastercard', 'paypal', 'bank_transfer', 'american_express')
            .default('visa')
            .messages({
                'any.only': 'Payment method must be one of: visa, mastercard, paypal, bank_transfer, american_express'
            }),

        cardNumber: joi.string()
            .pattern(/^\d{16}$/)
            .when('method', {
                is: joi.string().valid('visa', 'mastercard', 'american_express'),
                then: joi.required(),
                otherwise: joi.optional()
            })
            .messages({
                'string.pattern.base': 'Card number must be 16 digits',
                'any.required': 'Card number is required for card payments'
            }),

        cvv: joi.string()
            .pattern(/^\d{3,4}$/)
            .when('method', {
                is: joi.string().valid('visa', 'mastercard', 'american_express'),
                then: joi.required(),
                otherwise: joi.optional()
            })
            .messages({
                'string.pattern.base': 'CVV must be 3 or 4 digits',
                'any.required': 'CVV is required for card payments'
            }),

        expiryDate: joi.string()
            .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
            .when('method', {
                is: joi.string().valid('visa', 'mastercard', 'american_express'),
                then: joi.required(),
                otherwise: joi.optional()
            })
            .messages({
                'string.pattern.base': 'Expiry date must be in MM/YY format',
                'any.required': 'Expiry date is required for card payments'
            }),

        cardHolderName: joi.string()
            .min(2)
            .max(100)
            .when('method', {
                is: joi.string().valid('visa', 'mastercard', 'american_express'),
                then: joi.required(),
                otherwise: joi.optional()
            })
            .messages({
                'string.min': 'Card holder name must be at least 2 characters',
                'string.max': 'Card holder name must not exceed 100 characters',
                'any.required': 'Card holder name is required for card payments'
            })
    })
}

// Update payment method validation schema
export const updatePaymentMethodSchema = {
    params: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Payment method ID must be a number',
                'number.integer': 'Payment method ID must be an integer',
                'number.positive': 'Payment method ID must be a positive number',
                'any.required': 'Payment method ID is required'
            })
    }),

    body: joi.object({
        method: joi.string()
            .valid('visa', 'mastercard', 'paypal', 'bank_transfer', 'american_express')
            .optional()
            .messages({
                'any.only': 'Payment method must be one of: visa, mastercard, paypal, bank_transfer, american_express'
            }),

        cardNumber: joi.string()
            .pattern(/^\d{16}$/)
            .optional()
            .messages({
                'string.pattern.base': 'Card number must be 16 digits'
            }),

        cvv: joi.string()
            .pattern(/^\d{3,4}$/)
            .optional()
            .messages({
                'string.pattern.base': 'CVV must be 3 or 4 digits'
            }),

        expiryDate: joi.string()
            .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
            .optional()
            .messages({
                'string.pattern.base': 'Expiry date must be in MM/YY format'
            }),

        cardHolderName: joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Card holder name must be at least 2 characters',
                'string.max': 'Card holder name must not exceed 100 characters'
            })
    })
}



// Delete payment method validation schema
export const deletePaymentMethodSchema = {
    params: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Payment method ID must be a number',
                'number.integer': 'Payment method ID must be an integer',
                'number.positive': 'Payment method ID must be a positive number',
                'any.required': 'Payment method ID is required'
            })
    })
}