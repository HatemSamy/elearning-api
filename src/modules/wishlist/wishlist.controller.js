import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { translateCourse } from '../../Utilities/reusable.helper.js';
const prisma = new PrismaClient()



// Add to Wishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.courseId);
  const userId = req.user.id;
  const lang = req.query.lang || "en";

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

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
    select: {
      id: true,
      course: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
          image: true,
          fees: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Course added to wishlist",
    data: {
      id: wishlist.id,
      course: translateCourse(wishlist.course, lang),
    },
  });
});


// Get Wishlist
export const getWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const lang = req.query.lang || "en";

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
          image: true,
          fees: true,
        },
      },
    },
  });

  if (!wishlist || wishlist.length === 0) {
    return next(new Error("No wishlist found for you", { cause: 404 }));
  }

  res.status(200).json({
    success: true,
    count: wishlist.length,
    data: wishlist.map(item => ({
      id: item.id,
      course: translateCourse(item.course, lang),
    })),
  });
});


// Remove from Wishlist
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

