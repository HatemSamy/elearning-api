import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { sendEmail } from '../../services/email.js'
import { 
    getPasswordResetOTPTemplate, 
    getPasswordResetSuccessTemplate, 
    EMAIL_SUBJECTS 
} from '../../services/emailTemplates.js'
const prisma = new PrismaClient()

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email,role: user.role},
        process.env.tokenSignature,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

// Register User
export const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return next(new Error('User already exists with this email', { cause: 400 }))
    }

    const saltRounds = parseInt(process.env.SALTROUND) || 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            phone
        }
    })

    const { password: _, ...userResponse } = user

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userResponse
    })
})

// Login User
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true, 
            username: true,
            isEmailVerified: true,
            authProvider: true,
            googleId: true,
            createdAt: true,
            updatedAt: true
        }
    })
    
    if (!user) {
        return next(new Error('Invalid email or password', { cause: 401 }))
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return next(new Error('Invalid email or password', { cause: 401 }))
    }
    
    const token = generateToken(user)
    const { password: _, ...userResponse } = user
    
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: userResponse,
            token
        }
    })
})

// Google OAuth Success
export const googleAuthSuccess = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new Error('Authentication failed', { cause: 401 }))
    }

    const token = generateToken(req.user)

    const { password, ...userResponse } = req.user

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendURL}/oauth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(userResponse))}`)
})

// Google OAuth Failure
export const googleAuthFailure = asyncHandler(async (req, res, next) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendURL}/?error=Authentication failed`)
})



const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
}


// Forgot Password - Send OTP to email
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return next(new Error('No account found with this email address', { cause: 404 }))
    }

    // Check if user registered with Google OAuth
    if (user.authProvider === 'google') {
        return next(new Error('This account was created with Google. Please use Google Sign-In to access your account', { cause: 400 }))
    }

    const otp = generateOTP()

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
        where: { email },
        data: {
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: otpExpires
        }
    })

    const emailSubject = EMAIL_SUBJECTS.PASSWORD_RESET_OTP
    const emailMessage = getPasswordResetOTPTemplate(user.username, otp)

    try {
        await sendEmail(email, emailSubject, emailMessage)
        
        res.status(200).json({
            success: true,
            message: 'Password reset OTP has been sent to your email address',
            data: {
                email: email,
                expiresIn: '10 minutes'
            }
        })
    } catch (error) {
        // If email sending fails, remove the OTP from database
        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordOTP: null,
                resetPasswordOTPExpires: null
            }
        })
        
        return next(new Error('Failed to send email. Please try again later', { cause: 500 }))
    }
})

// Verify OTP
export const verifyOTP = asyncHandler(async (req, res, next) => {
    const { otp } = req.body

    const otpString = typeof otp === 'number' ? otp.toString() : otp

    const user = await prisma.user.findFirst({
        where: { 
            resetPasswordOTP: otpString,
            resetPasswordOTPExpires: {
                gt: new Date() 
            }
        }
    })

    if (!user) {
        return next(new Error('Invalid or expired OTP', { cause: 400 }))
    }

    // Generate secure reset token (UUID)
    const resetToken = crypto.randomUUID()
    
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordTokenExpires: resetTokenExpires,
            resetPasswordOTP: null,
            resetPasswordOTPExpires: null
        }
    })

    res.status(200).json({
        success: true,
        message: 'OTP verified successfully. You can now reset your password',
        data: {
            verified: true,
            resetToken: resetToken,
            expiresIn: '15 minutes',
            message: 'Please proceed to reset your password'
        }
    })
})

// Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { newPassword, resetToken } = req.body

    if (!newPassword || !resetToken) {
        return next(new Error('New password and reset token are required', { cause: 400 }))
    }

    const user = await prisma.user.findFirst({
        where: { 
            resetPasswordToken: resetToken,
            resetPasswordTokenExpires: {
                gt: new Date() 
            }
        }
    })

    if (!user) {
        return next(new Error('Invalid or expired reset token', { cause: 400 }))
    }

    const saltRounds = parseInt(process.env.SALTROUND) || 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpires: null
        }
    })

    // Send confirmation email 
    const emailSubject = EMAIL_SUBJECTS.PASSWORD_RESET_SUCCESS
    const emailMessage = getPasswordResetSuccessTemplate(user.username)

    try {
        await sendEmail(user.email, emailSubject, emailMessage)
    } catch (error) {
        console.error('Failed to send confirmation email:', error)
    }

    res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password',
        data: {
            email: user.email,
            resetAt: new Date().toISOString()
        }
    })
})




export const changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    })

    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
        return next(new Error('Current password is incorrect', { cause: 401 }))
    }

    const saltRounds = parseInt(process.env.SALTROUND) || 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    })

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: {
            userId: user.id,
            changedAt: new Date().toISOString()
        }
    })
})