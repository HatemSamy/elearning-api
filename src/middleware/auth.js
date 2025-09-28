import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from './errorHandling.js'

const prisma = new PrismaClient()
export const auth = (allowedRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(process.env.BearerKey)[1]; 

    if (!token) {
      return next(new Error("Access token is required", { cause: 401 }));
    }

    try {
      const decoded = jwt.verify(token, process.env.tokenSignature);

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
          role: true, 
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return next(new Error("User not found", { cause: 401 }));
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return next(new Error("Forbidden: insufficient permissions ,Access denied", { cause: 403 }));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new Error("Invalid or expired token", { cause: 401 }));
    }
  });
};




// Middleware to check if user is authenticated (for session-based auth)
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return next(new Error('Authentication required', { cause: 401 }))
}