import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { paginate } from '../../services/pagination.js';

const prisma = new PrismaClient()

// Enroll user in a course
export const enrollInCourse = asyncHandler(async (req, res, next) => {
 const courseId = Number(req.params.courseId);
const userId = req.user.id;

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    return next(new Error('Course not found', { cause: 404 }))
  }

  // Check if user is already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  })

  if (existingEnrollment) {
    return next(new Error('User is already enrolled in this course', { cause: 409 }))
  }

  // Check if payment is required and completed
//   if (course.price > 0) {
//     const successfulPayment = await prisma.payment.findFirst({
//       where: {
//         userId,
//         courseId,
//         status: 'success'
//       }
//     })

//     if (!successfulPayment) {
//       return next(new Error('Payment required for this course', { cause: 402 }))
//     }
//   }

  // Create enrollment
  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true
        }
      }
    }
  })

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    enrollment
  })
})





// Get user enrollments (with pagination, without status filter)
export const getUserEnrollments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, size = 10 } = req.query;
  const { limit, skip } = paginate(Number(page), Number(size));

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          price: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' },
    skip,
    take: limit
  });

  const totalEnrollments = await prisma.enrollment.count({
    where: { userId }
  });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    enrollments,
    pagination: {
      page: Number(page),
      limit,
      total: totalEnrollments,
      totalPages: Math.ceil(totalEnrollments / limit)
    }
  });
});

