import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import path from 'path';
const prisma = new PrismaClient()

// Create Course
export const createCourse = asyncHandler(async (req, res, next) => {
    const { title, description, price } = req.body;

    // Check if file was uploaded successfully
    if (!req.file) {
        return next(new Error("Course image is required", { cause: 400 }));
    }

    // Validate required fields
    if (!title || !description || !price) {
        return next(new Error("Title, description, and price are required", { cause: 400 }));
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/course/${req.file.filename}`;

    console.log('Image URL:', imageUrl);
    
    const course = await prisma.course.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            image: imageUrl 
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