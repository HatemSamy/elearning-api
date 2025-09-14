import { Router } from 'express'
import { 
    addToCart, 
    getCart, 
    removeFromCart, 
    clearCart,  
} from './cart.controller.js'
import { validation } from '../../middleware/validation.js'
import { 
    addToCartSchema, 
    removeFromCartSchema, 
    clearCartSchema 
} from './cart.validation.js'
import { auth } from '../../middleware/auth.js'

const router = Router()

// All cart routes require authentication
router.use(auth())

// Add course to cart
router.post('/add/:courseId', validation(addToCartSchema), addToCart)

// Get user's cart
router.get('/', getCart)

// Remove item from cart
router.delete('/remove/:courseId', validation(removeFromCartSchema), removeFromCart)

// Clear entire cart
router.delete('/clear', validation(clearCartSchema), clearCart)

export default router
