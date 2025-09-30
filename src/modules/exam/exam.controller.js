import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { paginate } from '../../services/pagination.js';
const prisma = new PrismaClient()



//________________________createExamWithQuestions

export const createExamWithQuestions = asyncHandler(async (req, res) => {
  const {title, description, duration, totalMarks, questions } = req.body;
  const {courseId}=req.params
  const course = await prisma.course.findUnique({ where: { id: Number(courseId) } });
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  if (questions && !Array.isArray(questions)) {
    return res.status(400).json({ success: false, message: 'questions must be an array' });
  }

  if (Array.isArray(questions)) {
    for (const q of questions) {
      if (!q.text || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer || !q.mark) {
        return res.status(400).json({ success: false, message: 'Invalid question shape' });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: `Correct answer "${q.correctAnswer}" not in options for question: "${q.text}"`,
        });
      }
    }
  }

  const exam = await prisma.exam.create({
    data: {
      courseId: Number(courseId),
      title,
      description: description ?? null,
      duration: Number(duration),
      totalMarks: Number(totalMarks),
      questions: {
        create: (questions || []).map((q) => ({
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          mark: Number(q.mark),
        })),
      },
    },
    include: { questions: true },
  });

  return res.status(201).json({ success: true, message: 'Exam with questions created', exam });
});








// Get Exam by ID
export const getExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const exam = await prisma.exam.findUnique({
  where: { id: Number(examId) },
  include: {
    questions: {
      select: {
        id: true,
        text: true,
        options: true,
        mark: true
      }
    }
  }
});

  if (!exam) return next(new Error("Exam not found", { cause: 404 }));

  res.status(200).json({ success: true, data: exam });
});

// Submit Exam
// export const submitExam = asyncHandler(async (req, res) => {
//   const { examId, answers } = req.body;
//   const userId = req.user.id;

//   const exam = await prisma.exam.findUnique({
//     where: { id: examId },
//     include: { questions: { include: { options: true } } },
//   });

//   if (!exam) return res.status(404).json({ message: "Exam not found" });

//   let score = 0;

//   const submission = await prisma.examSubmission.create({
//     data: {
//       userId,
//       examId,
//       answers: {
//         create: answers.map((a) => {
//           const question = exam.questions.find((q) => q.id === a.questionId);
//           const option = question?.options.find((o) => o.id === a.selectedOptionId);

//           if (option?.isCorrect) score++;

//           return {
//             questionId: a.questionId,
//             selectedOptionId: a.selectedOptionId,
//           };
//         }),
//       },
//       score,
//     },
//     include: { answers: true },
//   });

//   res.json({ success: true, submission });
// });




export const submitExam = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const {answers } = req.body; 
    const examId = parseInt(req.params.examId, 10)
 
    // Prevent multiple submissions
    const existing = await prisma.examSubmission.findUnique({
        where: { userId_examId: { userId, examId } },
    });
    if (existing) {
        return res.status(400).json({ success: false, message: 'You already submitted this exam' });
    }

    // Fetch exam with questions
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { questions: true },
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    let score = 0;
    const results = [];

    // Check answers
    for (const q of exam.questions) {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || null;
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) score += q.mark;

        results.push({
            questionId: q.id,
            question: q.text,
            userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect,
            mark: q.mark,
        });
    }

    // Store submission with total score
    const submission = await prisma.examSubmission.create({
        data: { userId, examId, score },
    });

    res.json({
        success: true,
        submission: {
            id: submission.id,
            examId: submission.examId,
            userId: submission.userId,
            score: submission.score,
            results, // return correct/incorrect answers
        },
    });
});



// export const getUserCourseExams = asyncHandler(async (req, res) => {
//     const userId = req.user.id;
//     if (isNaN(userId)) {
//         return res.status(400).json({ success: false, message: 'Invalid userId' });
//     }

//     const enrollments = await prisma.enrollment.findMany({
//         where: { userId},
//         select: { courseId: true }
//     });

//     const courseIds = enrollments.map(e => e.courseId);
//     if (!courseIds.length) {
//         return res.json({ success: true, data: [] });
//     }

//     const exams = await prisma.exam.findMany({
//         where: { courseId: { in: courseIds } },
//         include: {
//             examSubmissions: {
//                 where: { userId },
//                 select: { score: true, submittedAt: true }
//             },
//             questions: true,
//             course: {
//                 select: { name_en: true, name_ar: true } 
//             }
//         }
//     });

//     const data = exams.map(exam => ({
//         examId: exam.id,
//         courseId: exam.courseId,
//         courseName: exam.course.name_en, 
//         title: exam.title,
//         description: exam.description,
//         duration: exam.duration,
//         totalMarks: exam.totalMarks,
//         userScore: exam.examSubmissions.length ? exam.examSubmissions[0].score : null,
//         submittedAt: exam.examSubmissions.length ? exam.examSubmissions[0].submittedAt : null,
//         questions: exam.questions.map(q => ({
//             questionId: q.id,
//             text: q.text,
//             correctAnswer: q.correctAnswer,
//         }))
//     }));

//     res.json({ success: true, data });
// });

export const getUserEnrolledCourseExams = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // 1️⃣ Get user's enrolled courses
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true }
    });

    const courseIds = enrollments.map(e => e.courseId);
    if (!courseIds.length) {
        return res.json({ success: true, data: [] });
    }

    // 2️⃣ Get all exams for enrolled courses
    const exams = await prisma.exam.findMany({
        where: { courseId: { in: courseIds } },
        include: {
            course: { select: { id: true, name_en: true, name_ar: true } },
            submissions: {
                where: { userId },
                select: { id: true, score: true, submittedAt: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // 3️⃣ Format response
    const data = exams.map(exam => {
        const submitted = exam.submissions.length > 0;
        return {
            examId: exam.id,
            examTitle: exam.title,
            totalMarks: exam.totalMarks,
            courseId: exam.course.id,
            courseName: exam.course.name_en,
            status: submitted ? "completed" : "pending",
            userScore: submitted ? exam.submissions[0].score : null,
            submittedAt: submitted ? exam.submissions[0].submittedAt : null
        };
    });

    res.json({ success: true, data });
});


