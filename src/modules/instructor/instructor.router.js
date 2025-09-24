
import { Router } from 'express'
import * as InstructorController from './instructor.controller.js';
import { validation } from '../../middleware/validation.js'
import * as validators from './instructor.validation.js';
import { auth } from '../../middleware/auth.js';
const router =Router();

router.post(
  '/',
  validation(validators.createInstructorSchema), 
  InstructorController.createInstructor         
);

router.get("/", auth(), InstructorController.getInstructors);


export default router;
