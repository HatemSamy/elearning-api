import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { paginate } from '../../services/pagination.js';

const prisma = new PrismaClient()

// Enroll user in a course
export const enrollInCourse = asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.courseId);
  const userId = req.user.id;
  const { EnrollmentMode } = req.body; 

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    return next(new Error('Course not found', { cause: 404 }));
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    }
  });

  if (existingEnrollment) {
    return next(new Error('User is already enrolled in this course', { cause: 409 }));
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      EnrollmentMode 
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
          name_en: true,      
          name_ar: true,       
          overview_en: true,   
          overview_ar: true,   
          fees: true,
          image: true          
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in course',
    enrollment
  });
});







// Get user enrollments (with pagination, without status filter)
export const getUserEnrollments = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, size = 10, lang = 'en' } = req.query; // default to 'en'
  const { limit, skip } = paginate(Number(page), Number(size));

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
          overview_en: true,
          overview_ar: true,
          fees: true,
          image: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' },
    skip,
    take: limit
  });

  const totalEnrollments = await prisma.enrollment.count({ where: { userId } });

  // Map courses to selected language
  const mappedEnrollments = enrollments.map(e => ({
    ...e,
    course: {
      id: e.course.id,
      name: lang === 'ar' ? e.course.name_ar : e.course.name_en,
      overview: lang === 'ar' ? e.course.overview_ar : e.course.overview_en,
      fees: e.course.fees,
      image: e.course.image
    }
  }));

  res.status(200).json({
    success: true,
    count: mappedEnrollments.length,
    enrollments: mappedEnrollments,
    pagination: {
      page: Number(page),
      limit,
      total: totalEnrollments,
      totalPages: Math.ceil(totalEnrollments / limit)
    }
  });
});



