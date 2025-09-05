import joi from 'joi'

// Register validation schema
export const registerSchema = {
    body: joi.object({
        username: joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must not exceed 30 characters',
                'any.required': 'Username is required'
            }),
        
        email: joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        
        password: joi.string()
            .min(6)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password must not exceed 100 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'Password is required'
            }),
        
        cpassword: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'string.empty': 'Confirm password is required',
                'any.required': 'Confirm password is required'
            }),
        
        phone: joi.string()
            .pattern(new RegExp('^[+]?[1-9]\\d{1,14}$'))
            .required()
            .messages({
                'string.empty': 'Phone number is required',
                'string.pattern.base': 'Please provide a valid phone number',
                'any.required': 'Phone number is required'
            })
    })
}

// Login validation schema
export const loginSchema = {
    body: joi.object({
        email: joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        
        password: joi.string()
            .min(1)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
    })
}

// Forgot password validation schema
export const forgotPasswordSchema = {
    body: joi.object({
        email: joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            })
    })
}

// Verify OTP validation schema
export const verifyOTPSchema = {
    body: joi.object({
        otp: joi.alternatives()
            .try(
                joi.string()
                    .length(4)
                    .pattern(/^[0-9]+$/),
                joi.number()
                    .integer()
                    .min(1000)
                    .max(9999)
            )
            .required()
            .messages({
                'alternatives.match': 'OTP must be exactly 4 digits',
                'string.length': 'OTP must be exactly 4 digits',
                'string.pattern.base': 'OTP must contain only numbers',
                'number.min': 'OTP must be exactly 4 digits',
                'number.max': 'OTP must be exactly 4 digits',
                'any.required': 'OTP is required'
            })
    })
}

// Reset password validation schema
export const resetPasswordSchema = {
    body: joi.object({
        newPassword: joi.string()
            .min(6)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
            .required()
            .messages({
                'string.empty': 'New password is required',
                'string.min': 'New password must be at least 6 characters long',
                'string.max': 'New password must not exceed 100 characters',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'New password is required'
            }),

            resetToken: joi.string()
            .required()
            .messages({
                'string.empty': 'resetToken is required',
                'any.required': 'resetToken is required'
            }),
        
        confirmNewPassword: joi.string()
            .valid(joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'string.empty': 'Confirm new password is required',
                'any.required': 'Confirm new password is required'
            })
    })
}



// Change Password Schema 
export const changePasswordSchema = joi.object({
    body: joi.object({
        currentPassword: joi.string().min(6).required().messages({
            'string.empty': 'Current password is required',
            'string.min': 'Current password must be at least 6 characters'
        }),
        newPassword: joi.string().min(6).required().messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters'
        }),
        confirmPassword: joi.string().valid(joi.ref('body.newPassword')).required().messages({
            'any.only': 'Confirm password must match the new password',
            'string.empty': 'Confirm password is required'
        })
    })
})
