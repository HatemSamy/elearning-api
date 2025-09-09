import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
const prisma = new PrismaClient()



export const addToWishlist = asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.courseId);
  const userId = req.user.id;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (existing) {
    return next(new Error("Course already in wishlist", { cause: 409 }));
  }

  const wishlist = await prisma.wishlist.create({
    data: { userId, courseId },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          image: true,
          fees: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Course added to wishlist",
    data: wishlist,
  });
});



export const getWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          image: true,
          fees: true,
        },
      },
    },
  });
 if (!wishlist) {
    return next(new Error("not found any wishlist for you", { cause: 409 }));
  }

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});




export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.courseId);
  const userId = req.user.id;

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (!existing) {
    return next(new Error("Course not found in wishlist", { cause: 404 }));
  }

  await prisma.wishlist.delete({
    where: { id: existing.id },
  });

  res.status(200).json({
    success: true,
    message: "Course removed from wishlist",
  });
});
