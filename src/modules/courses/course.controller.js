import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
const prisma = new PrismaClient()

// Create Course
export const createCourse = asyncHandler(async (req, res, next) => {
    const courseData = { ...req.body };
    
 // Check if file was uploaded successfully
    if (!req.file) {
        return next(new Error("Course image is required", { cause: 400 }));
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/course/${req.file.filename}`;
    // Parse JSON strings for complex fields
    const parseJsonField = (field) => {
        return typeof field === 'string' ? JSON.parse(field) : field;
    };

    const course = await prisma.course.create({
        data: {
            image: imageUrl,
            name: courseData.name,
            duration: courseData.duration,
            location: courseData.location,
            startDate: new Date(courseData.startDate),
            endDate: new Date(courseData.endDate),
            fees: courseData.fees,
            language: courseData.language,
            overview: courseData.overview || null,
            objectives: parseJsonField(courseData.objectives),
            outcomes: courseData.outcomes || null,
            agenda: courseData.agenda ? parseJsonField(courseData.agenda) : null,
            examination: courseData.examination || null,
            accreditation: courseData.accreditation,
            paymentMethods: parseJsonField(courseData.paymentMethods),
            instructorId: courseData.instructorId ? parseInt(courseData.instructorId) : null
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        }
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course
    });
});


// Get All Courses
export const getAllCourses = asyncHandler(async (req, res, next) => {
    const courses = await prisma.course.findMany({
        include: {
            instructor: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (courses.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No courses found',
            data: [],
            count: 0
        })
    }

    res.status(200).json({
        success: true,
        message: 'Courses retrieved successfully',
        data: courses,
        count: courses.length
    })
})

// Get Course by ID
export const getCourseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const course = await prisma.course.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        }
    })

    if (!course) {
        return next(new Error('Course not found', { cause: 404 }))
    }

    res.status(200).json({
        success: true,
        message: 'Course retrieved successfully',
        data: course
    })
})