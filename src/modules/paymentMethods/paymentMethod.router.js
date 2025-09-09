import { Router } from 'express'
import * as paymentMethodController from './paymentMethod.controller.js'
import { validation } from '../../middleware/validation.js'
import { 
    createPaymentMethodSchema, 
    updatePaymentMethodSchema,
    deletePaymentMethodSchema
} from './paymentMethod.validation.js'
import { auth } from '../../middleware/auth.js'

const router = Router()

// Create payment method
router.post('/', auth(), validation(createPaymentMethodSchema), paymentMethodController.createPaymentMethod)

// Get my payment methods
router.get('/my-methods',auth(), paymentMethodController.getMyPaymentMethods)


// Update payment method
router.put('/:id', auth(), validation(updatePaymentMethodSchema), paymentMethodController.updatePaymentMethod)

// Delete payment method
router.delete('/:id', auth(), validation(deletePaymentMethodSchema), paymentMethodController.deletePaymentMethod)

export default router