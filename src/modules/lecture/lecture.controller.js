import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
const prisma = new PrismaClient()


// controllers/lectureController.js
export const addLecture = asyncHandler(async (req, res, next) => {
  const { title_en, title_ar, overview_en, overview_ar, duration } = req.body;
  const courseId = parseInt(req.params.courseId);

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new Error("Course not found", { cause: 404 });
  }

  const lastLecture = await prisma.lecture.findFirst({
    where: { courseId },
    orderBy: { number: "desc" },
  });
  const nextNumber = lastLecture ? lastLecture.number + 1 : 1;
  const videoUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/course_lectures/course_${courseId}/lectures/${req.file.filename}`
    : null;

  const lecture = await prisma.lecture.create({
    data: {
      title_en,
      title_ar,
      overview_en,
      overview_ar,
      duration: duration ? parseInt(duration) : 0,
      number: nextNumber,
      videoUrl,
      courseId,
    },
  });

  res.status(201).json({ success: true, lecture });
});




export const getLectureDetails = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { lang = "en" } = req.query; 

  const lecture = await prisma.lecture.findUnique({
  where: { id: parseInt(lectureId) },
  select: {
    id: true,
    title_en: true,
    title_ar: true,
    overview_en: true,
    overview_ar: true,
    duration: true,
    videoUrl: true,
    number: true,
    course: {
      select: {
        id: true,
        name_en: true,
        name_ar: true,
        duration_en: true,
        duration_ar: true,
        category: true,
        instructor: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    },
  },
});


    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const isArabic = lang === "ar";

    const response = {
      id: lecture.id,
      title: isArabic ? lecture.title_ar : lecture.title_en,
      overview: isArabic ? lecture.overview_ar : lecture.overview_en,
      duration: lecture.duration,
      videoUrl: lecture.videoUrl,
      number: lecture.number,
      course: {
        id: lecture.course.id,
        name: isArabic ? lecture.course.name_ar : lecture.course.name_en,
        duration: isArabic
          ? lecture.course.duration_ar
          : lecture.course.duration_en,
        category: lecture.course.category,
        instructor: lecture.course.instructor,
      },
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
};


