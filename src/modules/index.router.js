// E-learning API Routers
import authRouter from './auth/auth.router.js'
import courseRouter from './courses/course.router.js'
import paymentRouter from './payments/payment.router.js'
import paymentMethodRouter from './paymentMethods/paymentMethod.router.js'
import enrollmentRouter from './enrollment/enrollment.router.js'
import userRouter from './user/user.router.js'
import WishlistRouter from './wishlist/wishlist.router.js'
import cartRouter from './cart/cart.router.js'
import lectureRouter from './lecture/lecture.router.js'




export {
    authRouter,
    courseRouter,
    paymentRouter,
    paymentMethodRouter,
    enrollmentRouter,
    userRouter,
    WishlistRouter,
    cartRouter, 
    lectureRouter
}