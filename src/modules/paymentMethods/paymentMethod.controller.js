import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../../middleware/errorHandling.js'
// import {prisma} from '../../../config/connection.js'
const prisma = new PrismaClient()


// Add Payment Method
export const createPaymentMethod = asyncHandler(async (req, res, next) => {
    const paymentMethodData = { ...req.body };
    const userId = req.user.id; 

    // Security: Store only last 4 digits of card number
    const maskedCardNumber = paymentMethodData.cardNumber ? 
        '**** **** **** ' + paymentMethodData.cardNumber.slice(-4) : null;

    const paymentMethod = await prisma.paymentMethod.create({
        data: {
            userId: userId,
            method: paymentMethodData.method || 'visa',
            cardNumber: maskedCardNumber,
            cvv: null,
            expiryDate: paymentMethodData.expiryDate || null,
            cardHolderName: paymentMethodData.cardHolderName || null
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        }
    })

    res.status(201).json({
        success: true,
        message: 'Payment method created successfully',
        data: paymentMethod
    })
})


// Get My Payment Methods (from token)
export const getMyPaymentMethods = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; 

    const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Always return success, even if no payment methods found
    const message = paymentMethods.length === 0 
        ? 'No payment methods found' 
        : 'Your payment methods retrieved successfully';

    res.status(200).json({
        success: true,
        message: message,
        data: paymentMethods,
        count: paymentMethods.length
    })
})


// Update Payment Method
export const updatePaymentMethod = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const updateData = { ...req.body }
    const userId = req.user.id; 

    // Check if payment method exists
    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: parseInt(id) }
    })

    if (!existingPaymentMethod) {
        return next(new Error('Payment method not found', { cause: 404 }))
    }

    if (existingPaymentMethod.userId !== userId) {
        return next(new Error('You can only update your own payment methods', { cause: 403 }))
    }

    // Security: Mask card number if provided
    if (updateData.cardNumber) {
        updateData.cardNumber = '**** **** **** ' + updateData.cardNumber.slice(-4);
    }

    if (updateData.cvv) {
        delete updateData.cvv;
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        }
    })

    res.status(200).json({
        success: true,
        message: 'Payment method updated successfully',
        data: updatedPaymentMethod
    })
})

// Delete Payment Method
export const deletePaymentMethod = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id; 

    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: parseInt(id) }
    })

    if (!existingPaymentMethod) {
        return next(new Error('Payment method not found', { cause: 404 }))
    }

    // Check if the payment method belongs to the current user
    if (existingPaymentMethod.userId !== userId) {
        return next(new Error('You can only delete your own payment methods', { cause: 403 }))
    }

    await prisma.paymentMethod.delete({
        where: { id: parseInt(id) }
    })

    res.status(200).json({
        success: true,
        message: 'Payment method deleted successfully'
    })
})