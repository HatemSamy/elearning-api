import { Router } from 'express'
import * as createController from './course.controller.js'
import { validation } from '../../middleware/validation.js'
import { createCourseSchema, getCourseByIdSchema } from './course.validation.js'
import {auth} from '../../middleware/auth.js'
import {HME, myMulter} from '../../services/multer.js'
import { autoParseJsonMiddleware } from '../../middleware/autoParseJsonMiddleware.js'

const router = Router()
const upload = myMulter('course');

// Create course
router.post(
  '/',
  auth(),
  upload.single('image'),      
  autoParseJsonMiddleware,     
  validation(createCourseSchema), 
  HME,                         
  createController.createCourse
);
// Get all courses
router.get('/', createController.getCourses)

router.get('/filterBYCategoryAndLevel', createController.getCoursesByCategoryAndLevel);

// Get course Details
router.get('/:id', validation(getCourseByIdSchema), createController.getCourseDetails)


export default router