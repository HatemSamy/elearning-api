import { Router } from 'express'
import { createPayment, getAllPayments, updatePaymentStatus } from './payment.controller.js'
import { validation } from '../../middleware/validation.js'
import { createPaymentSchema, getPaymentsSchema, updatePaymentStatusSchema } from './payment.validation.js'
import {auth} from '../../middleware/auth.js'
const router = Router()

// Create payment
router.post('/',auth() ,validation(createPaymentSchema), createPayment)

// Get all payments (with optional userId filter)
router.get('/',auth(), validation(getPaymentsSchema), getAllPayments)

// Update payment status
router.put('/:id/status', validation(updatePaymentStatusSchema), updatePaymentStatus)

export default router