import { Router } from 'express'
import { createCourse, getAllCourses, getCourseById } from './course.controller.js'
import { validation } from '../../middleware/validation.js'
import { createCourseSchema, getCourseByIdSchema } from './course.validation.js'
import {auth} from '../../middleware/auth.js'
import {HME, myMulter} from '../../services/multer.js'

const router = Router()
const upload = myMulter('course');

// Create course
router.post('/', auth(), upload.single('image'), HME, validation(createCourseSchema), createCourse)

// Get all courses
router.get('/', getAllCourses)

// Get course by ID
router.get('/:id', validation(getCourseByIdSchema), getCourseById)

export default router