import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'

const prisma = new PrismaClient()

// Add course to cart
export const addToCart = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params
    const userId = req.user.id

    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })

    if (!course) {
        return next(new Error('Course not found', { cause: 404 }))
    }

    const existingCartItem = await prisma.cart.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    })

    if (existingCartItem) {
        return res.status(400).json({
            success: false,
            message: 'Course is already in your cart'
        })
    }

    const cartItem = await prisma.cart.create({
        data: {
            userId,
            courseId
        },
        include: {
            course: {
                select: {
                    id: true,
                    name: true,
                    fees: true,
                    image: true,
                    duration: true
                }
            }
        }
    })

    res.status(201).json({
        success: true,
        message: 'Course added to cart successfully',
        data: cartItem
    })
})

// Get user's cart
export const getCart = asyncHandler(async (req, res, next) => {
    const userId = req.user.id

    const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true,
                    name: true,
                    fees: true,
                    image: true,
                    duration: true,
                    language: true,
                    category: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const total = cartItems.reduce((sum, item) => {
        const courseFee = parseFloat(item.course.fees) || 0
        return sum + courseFee
    }, 0)

    res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: {
            items: cartItems,
            totalItems: cartItems.length,
            totalAmount: total.toFixed(2)
        }
    })
})


// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params
    const userId = req.user.id

    // Check if cart item exists
    const existingCartItem = await prisma.cart.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: parseInt(courseId)
            }
        }
    })

    if (!existingCartItem) {
        return next(new Error('Cart item not found', { cause: 404 }))
    }

    // Remove cart item
    await prisma.cart.delete({
        where: {
            userId_courseId: {
                userId,
                courseId: parseInt(courseId)
            }
        }
    })

    res.status(200).json({
        success: true,
        message: 'Course removed from cart successfully'
    })
})

// Clear entire cart
export const clearCart = asyncHandler(async (req, res, next) => {
    const userId = req.user.id

    // Delete all cart items for user
    const deletedItems = await prisma.cart.deleteMany({
        where: { userId }
    })

    res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
            deletedItems: deletedItems.count
        }
    })
})


