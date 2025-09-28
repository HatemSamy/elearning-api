import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
import { formatPurchase } from '../../Utilities/reusable.helper.js'


const prisma = new PrismaClient()


// Create Payment
export const createPayment = asyncHandler(async (req, res, next) => {
    const { courseId, amount } = req.body
    const userId = req.user.id;
console.log(userId);

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

    // Check if user already has a successful payment for this course
    const existingPayment = await prisma.payment.findFirst({
        where: {
            userId: parseInt(userId),
            courseId: parseInt(courseId),
            status: 'success'
        }
    })

    if (existingPayment) {
        return next(new Error('User has already successfully paid for this course', { cause: 400 }))
    }

    // Create payment record (pending status)
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
                    name_en: true,
                    fees: true,
                    image: true
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


// Get_PurchaseHistory
export const getPurchaseHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const lang = req.query.lang || "en";

  const payments = await prisma.payment.findMany({
    where: { userId},
    include: {
      course: true
    },
    orderBy: { createdAt: "desc" }
  });

  if (!payments || payments.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      message: lang === "ar" 
        ? "لا يوجد أي عمليات شراء مسجلة" 
        : "No purchase history found"
    });
  }

  const formattedPayments = payments.map(p => formatPurchase(p, lang));

  res.status(200).json({
    success: true,
    count: formattedPayments.length,
    history: formattedPayments
  });
});



