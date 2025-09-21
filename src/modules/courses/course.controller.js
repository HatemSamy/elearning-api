import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { translateCourse } from '../../Utilities/reusable.helper.js';
const prisma = new PrismaClient()

export const createCourse = asyncHandler(async (req, res, next) => {
  const courseData = { ...req.body };

  // Check if image uploaded
  if (!req.file) {
    return next(new Error("Course image is required", { cause: 400 }));
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/course/${req.file.filename}`;

  const course = await prisma.course.create({
    data: {
      image: imageUrl,
      name_en: courseData.name_en,
      name_ar: courseData.name_ar,
      duration_en: courseData.duration_en,
      duration_ar: courseData.duration_ar,
      overview_en: courseData.overview_en,
      overview_ar: courseData.overview_ar,
      objectives_en: courseData.objectives_en,   
      objectives_ar: courseData.objectives_ar,
      outcomes_en: courseData.outcomes_en,
      outcomes_ar: courseData.outcomes_ar,
      agenda_en: courseData.agenda_en,
      agenda_ar: courseData.agenda_ar,
      examination_en: courseData.examination_en,
      examination_ar: courseData.examination_ar,
      accreditation_en: courseData.accreditation_en,
      features_en: courseData.features_en,
      features_ar: courseData.features_ar,
      paymentMethods: courseData.paymentMethods,
      category: courseData.category,
      level: courseData.level,
      location: courseData.location,
      enrollmentMode: courseData.enrollmentMode,
      delegatesEnrolled: Number(courseData.delegatesEnrolled) || 0,
      fees: Number(courseData.fees),
      discount:courseData.discount ,
      startDate: courseData.startDate ? new Date(courseData.startDate) : null,
      endDate: courseData.endDate ? new Date(courseData.endDate) : null,
      language: courseData.language,
      instructorId: courseData.instructorId ? Number(courseData.instructorId) : null
    },
    include: {
      instructor: {
        select: { id: true, username: true, email: true }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course
  });
});






export const getCourseDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const lang = req.query.lang || "en"; 

  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      instructor: {
        select: { id: true, username: true, email: true }
      }
    }
  });

  if (!course) return next(new Error("Course not found", { cause: 404 }));

  const courseDetails = translateCourse(course, lang);

  res.status(200).json({
    success: true,
    message: "Course details fetched successfully",
    data: courseDetails
  });
});








export const getCourses = asyncHandler(async (req, res, next) => {
  const lang = req.query.lang || "en";

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name_en: true,
      name_ar: true,
      duration_en: true,
      duration_ar: true,
      overview_en: true,
      overview_ar: true,
      fees: true,
      discount: true,
      image: true,
      category: true,
      level: true,
      language: true,
      location: true,
      delegatesEnrolled: true,
      instructor: {
        select: { id: true, username: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!courses || courses.length === 0) {
    return next(new Error("No courses found", { cause: 404 }));
  }

  const formattedCourses = courses.map((course) => translateCourse(course, lang));

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    courses: formattedCourses
  });
});





export const getCoursesByCategoryAndLevel = asyncHandler(async (req, res, next) => {
  const { category, level, lang = "en" } = req.query; 

  if (!category || !level) {
    return res.status(400).json({
      success: false,
      message: "Category and level are required",
    });
  }

  // Fetch courses matching category and level
  const courses = await prisma.course.findMany({
  where: {
    category,
    level,
  },
  select: {
    id: true,
    name_en: true,
    name_ar: true,
    duration_en: true,
    duration_ar: true,
    overview_en: true,
    overview_ar: true,
    image: true,
    paymentMethods: true,
    category: true,
    level: true,
    delegatesEnrolled: true,
    language: true,
    location: true,
    fees: true,
    discount: true,
   
    // nested select for instructor
    instructor: {
      select: {
        id: true,
        username: true,
        email: true
      }
    }
  }
});


  if (!courses || courses.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No courses found for this category and level",
    });
  }

  // Apply translation
  const formattedCourses = courses.map((course) => translateCourse(course, lang));

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    data: formattedCourses,
  });
});





export const filterCourses = asyncHandler(async (req, res, next) => {
  const { 
    lang = "en", 
    category, 
    level, 
    minPrice, 
    maxPrice, 
    minDuration, 
    maxDuration 
  } = req.query;

  // بناء الشرط الديناميكي
  const where = {};

  if (category) {
    where.category = category;
  }

  if (level) {
    where.level = level;
  }

  if (minPrice || maxPrice) {
    where.fees = {};
    if (minPrice) where.fees.gte = Number(minPrice);
    if (maxPrice) where.fees.lte = Number(maxPrice);
  }

  if (minDuration || maxDuration) {
    where.duration_en = {}; 
    if (minDuration) where.duration_en.gte = Number(minDuration);
    if (maxDuration) where.duration_en.lte = Number(maxDuration);
  }

  const courses = await prisma.course.findMany({
    where,
    select: {
      id: true,
      name_en: true,
      name_ar: true,
      fees: true,
      duration_en: true,
      duration_ar: true,
      category: true,
      level: true,
      instructor: { 
        select: { id: true, username: true, email: true } 
      }
    }
  });

  if (!courses.length) {
    return next(new Error("No courses found with applied filters", { cause: 404 }));
  }

  const formattedCourses = courses.map((course) => translateCourse(course, lang));

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    courses: formattedCourses
  });
});
