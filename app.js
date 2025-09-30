import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from './config/passport.js'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config(); 
import express from 'express'
import * as indexRouter from './src/modules/index.router.js'
import { connectDB } from './config/connection.js'
import { globalErrorHandling } from './src/middleware/errorHandling.js'
const app = express()

// setup port and the baseUrl
const PORT = process.env.PORT || 3001
const baseUrl = process.env.BASEURL





const allowedOrigins = [
  "http://194.238.22.100",       
  "http://194.238.22.100:5173",  
  "http://194.238.22.100:5000",  
  undefined,
  null
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); 
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Session config for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,          
    sameSite: "lax",        
    maxAge: 24 * 60 * 60 * 1000 
  }
}));




app.use(passport.initialize())
app.use(passport.session())

//convert Buffer Data
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use((req, res, next) => {
  req.setTimeout(1 * 60 * 1000); 
  next();
});
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
app.use(`${baseUrl}/cart`, indexRouter.cartRouter)
app.use(`${baseUrl}/lecture`, indexRouter.lectureRouter)
app.use(`${baseUrl}/instructor`, indexRouter.instructorRouter)
app.use(`${baseUrl}/exam`, indexRouter.ExamRouter)




app.get("/Welcome_API", (req, res) => {
    const filePath = path.join(__dirname, "src", "templates", "banner.html");
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error loading banner:", err);
        res.status(500).send("Error loading banner");
      }
    });
  });


app.use('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})


connectDB()
// Handling Error
app.use(globalErrorHandling)
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));