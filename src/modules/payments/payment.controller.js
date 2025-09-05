import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'

const prisma = new PrismaClient()

// Create Payment
export const createPayment = asyncHandler(async (req, res, next) => {
    const { userId, courseId, amount } = req.body

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    })

    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) }
    })

    if (!course) {
        return next(new Error('Course not found', { cause: 404 }))
    }

    // Check if user already has a payment for this course
    const existingPayment = await prisma.payment.findFirst({
        where: {
            userId: parseInt(userId),
            courseId: parseInt(courseId),
            status: 'pending'
        }
    })

    if (existingPayment) {
        return next(new Error('User has already successfully paid for this course', { cause: 400 }))
    }

    // Create payment
    const payment = await prisma.payment.create({
        data: {
            userId: parseInt(userId),
            courseId: parseInt(courseId),
            amount: parseFloat(amount),
            status: 'pending'
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
                    price: true
                }
            }
        }
    })

    res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
    })
})

// Get All Payments
export const getAllPayments = asyncHandler(async (req, res, next) => {
    const { userId } = req.query

    let whereClause = {}
    
    // If userId is provided, filter by user
    if (userId) {
        whereClause.userId = parseInt(userId)
    }

    const payments = await prisma.payment.findMany({
        where: whereClause,
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
                    price: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (payments.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No payments found',
            data: [],
            count: 0
        })
    }
    res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
        count: payments.length
    })

    
})

// Update Payment Status
export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
        where: { id: parseInt(id) }
    })

    if (!existingPayment) {
        return next(new Error('Payment not found', { cause: 404 }))
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
        where: { id: parseInt(id) },
        data: { status },
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
                    price: true
                }
            }
        }
    })

    res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: updatedPayment
    })
})