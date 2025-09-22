import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
const prisma = new PrismaClient()


export const addLecture = asyncHandler(async (req, res, next) => {
  const { title_en, title_ar, overview_en, overview_ar, duration } = req.body;
  const { courseId } = req.params;

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
  });

  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }

  const lastLecture = await prisma.lecture.findFirst({
    where: { courseId: Number(courseId) },
    orderBy: { number: "desc" },
  });

  const nextNumber = lastLecture ? lastLecture.number + 1 : 1;

  let videoUrl = null;
  if (req.file) {
    videoUrl = `/uploads/lectures/${req.file.filename}`;
  }

  // 4. إنشاء المحاضرة
  const lecture = await prisma.lecture.create({
    data: {
      title_en,
      title_ar,
      overview_en,
      overview_ar,
      duration: Number(duration),
      videoUrl,
      number: nextNumber,
      courseId: Number(courseId),
    },
  });

  res.status(201).json({
    success: true,
    message: "Lecture created successfully",
    data: lecture,
  });
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


