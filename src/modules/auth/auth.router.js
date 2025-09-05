import { Router } from 'express'
import passport from '../../config/passport.js'
import { validation } from '../../middleware/validation.js'
import { 
    registerSchema, 
    loginSchema, 
    forgotPasswordSchema, 
    verifyOTPSchema, 
    resetPasswordSchema ,
    changePasswordSchema
} from './auth.validation.js'
import * as authController from   './auth.controller.js'


import { auth} from '../../middleware/auth.js'

const router = Router()


router.get("/success", (req, res) => {
    const { token, user } = req.query;
  
    res.json({
      success: true,
      message: "Google login success",
      token,
      user: JSON.parse(user)
    });
});

// Traditional authentication routes
router.post('/register', validation(registerSchema), authController.registerUser)
router.post('/login', validation(loginSchema), authController.loginUser)

// Forgot password routes
router.post('/forgot-password', validation(forgotPasswordSchema), authController.forgotPassword)
router.post('/verify-otp', validation(verifyOTPSchema), authController.verifyOTP)
router.post('/reset-password', validation(resetPasswordSchema), authController.resetPassword)
router.put('/change-password',auth(),validation(changePasswordSchema),authController.changePassword)

// Google OAuth routes
router.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
)

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/oauth-success?error=Google authentication failed' 
    }),
    authController.googleAuthSuccess
)

router.get('/google/success', authController.googleAuthSuccess)
router.get('/google/failure', authController.googleAuthFailure)

// Protected routes
router.get('/profile', auth(), authController.getProfile)

export default router