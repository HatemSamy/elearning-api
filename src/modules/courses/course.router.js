import { Router } from 'express'
import * as courseController from './course.controller.js'
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
  courseController.createCourse
);
// Get all courses
router.get('/', courseController.getCourses)

router.get('/filters', courseController.filterCourses)


router.get('/filter-by-category-level', courseController.getCoursesByCategoryAndLevel);

// Get course Details
router.get('/:id', validation(getCourseByIdSchema), courseController.getCourseDetails)


// GET /api/courses/:id/content
router.get("/:id/content", auth(), courseController.getCourseContent);


export default router