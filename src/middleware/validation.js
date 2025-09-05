import joi from 'joi'

// Validation middleware
export const validation = (schema) => {
    return (req, res, next) => {
        const validationKeys = ['body', 'params', 'query', 'headers']
        const validationErrors = []

        validationKeys.forEach(key => {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], { abortEarly: false })
                if (error) {
                    validationErrors.push(...error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message,
                        location: key
                    })))
                }
            }
        })

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            })
        }

        next()
    }
}