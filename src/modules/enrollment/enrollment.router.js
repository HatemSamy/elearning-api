import { Router } from 'express'
import * as enrollmentController from   './enrollment.controller.js'
import * as validationSchema from  './enrollment.validation.js'

import { validation } from '../../middleware/validation.js'
import {auth} from '../../middleware/auth.js'
const router = Router()

// Create payment
router.post('/:courseId',auth() ,validation(validationSchema.enrollInCourseSchema), enrollmentController.enrollInCourse)

router.get('/my-courses', auth(), enrollmentController.getUserEnrollments);



export default router