import { Router } from "express";
import { createPayment, getAllPayments, getPurchaseHistory } from "./payment.controller.js";
import { createPaymentSchema, getPaymentsSchema, updatePaymentStatusSchema } from "./payment.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
const router = Router()

// Create payment
router.post('/',auth() ,validation(createPaymentSchema), createPayment)

// Get all payments (with optional userId filter)
router.get('/',auth(), validation(getPaymentsSchema), getAllPayments)



// Get purchase history for logged-in user
router.get("/history", auth(), getPurchaseHistory);

export default router