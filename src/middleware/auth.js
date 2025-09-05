import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from './errorHandling.js'

const prisma = new PrismaClient()

// Unified auth middleware function - works for all routes
export const auth = () => {
    return asyncHandler(async (req, res, next) => {
        const token = req.headers.authorization?.split(process.env.BearerKey)[1] // Bearer TOKEN

        if (!token) {
            return next(new Error('Access token is required', { cause: 401 }))
        }

        try {
            const decoded = jwt.verify(token, process.env.tokenSignature)
            
            // Get user from database
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    isEmailVerified: true,
                    authProvider: true,
                    createdAt: true,
                    updatedAt: true
                }
            })

            if (!user) {
                return next(new Error('User not found', { cause: 401 }))
            }

            req.user = user
            next()
        } catch (error) {
            return next(new Error('Invalid or expired token', { cause: 401 }))
        }
    })
}

// Middleware to check if user is authenticated (for session-based auth)
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return next(new Error('Authentication required', { cause: 401 }))
}