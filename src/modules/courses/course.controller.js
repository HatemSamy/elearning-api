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
      fees: Number(courseData.fees) || 0,
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
    include: { instructor: { select: { id: true, username: true, email: true } } }
  });
  if (!courses) return next(new Error("not found Courses", { cause: 404 }));

  const formattedCourses = courses.map((course) => translateCourse(course, lang));

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    courses: formattedCourses
  });
});












// export const getCoursesByCategoryAndLevel = asyncHandler(async (req, res, next) => {
//     const { category, level } = req.query;
  
//     const courses = await prisma.course.findMany({
//       where: {
//         category: category,   
//         level: level          
//       },
//       select: {
//         id: true,
//         name: true,
//         category: true,
//         level: true,
//         fees: true,
//         image: true,
//         duration: true
//       }
//     });
  

//     if (!courses || courses.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No courses found for this category and level"
//         });
//       }

//     res.status(200).json({
//       success: true,
//       count: courses.length,
//       data: courses
//     });
//   });
  



export const getCoursesByCategoryAndLevel = asyncHandler(async (req, res, next) => {
  const { category, level } = req.query;
  const lang = req.lang; // جاي من middleware

  if (!category || !level) {
    return res.status(400).json({
      success: false,
      message: "Category and level are required"
    });
  }

  const courses = await prisma.course.findMany({
    where: {
      category: category,
      level: level
    },
    include: {
      instructor: {
        select: { id: true, username: true, email: true }
      }
    }
  });

  if (!courses || courses.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No courses found for this category and level"
    });
  }

  const formattedCourses = courses.map((course) => translateCourse(course, lang));

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    data: formattedCourses
  });
});