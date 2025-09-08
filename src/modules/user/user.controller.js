import { asyncHandler } from "../../middleware/errorHandling.js"
import { PrismaClient } from '@prisma/client'




// Get current user profile
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
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
        return next(new Error('User not found', { cause: 404 }))
    }

    res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
    })
})


const prisma = new PrismaClient();

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.file) {
    req.body.avatar = `${req.protocol}://${req.get('host')}/uploads/user/${req.file.filename}`;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: req.body, 
    select: {
      id: true,
      username: true,
      phone: true,
      avatar: true,
    }
  });

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

