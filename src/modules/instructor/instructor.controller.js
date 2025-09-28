import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client';
import { asyncHandler} from '../../middleware/errorHandling.js';
import { formatInstructor, translateCourse } from '../../Utilities/reusable.helper.js';

const prisma = new PrismaClient();

export const createInstructor = asyncHandler(async (req, res, next) => {
  const { username, email, password, ...instructorFields } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new Error("User already exists with this email", { cause: 400 }));
  }

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND) || 12);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword, role: "INSTRUCTOR" },
  });

  const instructor = await prisma.instructor.create({
    data: { userId: user.id, ...instructorFields },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: formatInstructor(instructor), 
  });
});





// GET instructors
export const getInstructors = asyncHandler(async (req, res, next) => {
  const instructors = await prisma.instructor.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    count: instructors.length,
    data: formatInstructor(instructors),
  });
});




export const getInstructorCourses = asyncHandler(async (req, res, next) => {
  const instructorId = parseInt(req.params.instructorId);
  const lang = req.query.lang || "en";

  if (isNaN(instructorId)) {
    return next(new Error("Invalid instructor ID", { cause: 400 }));
  }


  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (!instructor) return next(new Error("Instructor not found", { cause: 404 }));

  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: {
      id: true,
      name_en: true,
      name_ar: true,
      overview_en: true,
      overview_ar: true,
      image: true,
      level: true,
      language: true,
      delegatesEnrolled: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!courses || courses.length === 0) {
    return next(new Error("No courses found for this instructor", { cause: 404 }));
  }

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    name: lang === "ar" ? course.name_ar : course.name_en,
    overview: lang === "ar" ? course.overview_ar : course.overview_en,
    image: course.image,
    level: course.level,
    delegatesEnrolled: course.delegatesEnrolled,
    language: course.language,
  }));

  res.status(200).json({
    success: true,
    instructor: {
      id: instructor.id,
      userId: instructor.user?.id || null,
      username: instructor.user?.username || "",
      avatar: instructor.user?.avatar || "",
      bio: instructor.bio || "",
      specialization: instructor.specialization || "",
      social: instructor.social || {},
    },
    count: formattedCourses.length,
    courses: formattedCourses,
  });
});



export const getInstructorAccount = asyncHandler(async (req, res, next) => {
  const instructorId = parseInt(req.params.instructorId);

  if (isNaN(instructorId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid instructor ID",
    });
  }

  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: {
      user: {
        select: {
          id:true,
          username: true,
          avatar: true
        },
      },
    },
  });

  if (!instructor) {
    return res.status(404).json({
      success: false,
      message: "Instructor not found",
    });
  }

  res.status(200).json({
    success: true,
    instructor: formatInstructor(instructor),
  });
});
