import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from './config/passport.js'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express'
import * as indexRouter from './src/modules/index.router.js'
import { connectDB } from './config/connection.js'
import { globalErrorHandling } from './src/middleware/errorHandling.js'
const app = express()

// setup port and the baseUrl
const port = process.env.PORT || 5000
const baseUrl = process.env.BASEURL

// CORS Configuration - Open for all origins
const corsOptions = {
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Session configuration for OAuth
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}))


app.use(passport.initialize())
app.use(passport.session())

//convert Buffer Data
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Demo route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth-demo.html'));
});

// OAuth success route
app.get('/oauth-success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'oauth-success.html'));
});

//Setup API Routing 
app.use(`${baseUrl}/auth`, indexRouter.authRouter)
app.use(`${baseUrl}/courses`, indexRouter.courseRouter)
app.use(`${baseUrl}/payments`, indexRouter.paymentRouter)
app.use(`${baseUrl}/payment-methods`, indexRouter.paymentMethodRouter)
app.use(`${baseUrl}/enrollment`, indexRouter.enrollmentRouter)
app.use(`${baseUrl}/users`, indexRouter.userRouter)
app.use(`${baseUrl}/wishlist`, indexRouter.WishlistRouter)




app.use('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})


connectDB()
// Handling Error
app.use(globalErrorHandling)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))