import { Router } from 'express'
import * as examController from   './exam.controller.js'
import * as validationSchema from  './exam.validation.js'
import { validation } from '../../middleware/validation.js'
import {auth} from '../../middleware/auth.js'
const router = Router()


// Create exam with questions
router.post(
  '/:courseId',
  auth(), 
  validation(validationSchema.createExamSchema), 
  examController.createExamWithQuestions
);

router.get(
  '/getUserCourseExams',
  auth(), 
  examController.getUserEnrolledCourseExams
);

router.get(
  '/:examId',
  auth(), 
  examController.getExam
);



router.post(
  '/:examId/submit',
  auth(), 
  examController.submitExam
);




export default router