import { Router } from 'express'
import { validation } from '../../middleware/validation.js'
import * as userController from   './user.controller.js'
import {auth} from '../../middleware/auth.js'
import { HME, myMulter } from '../../services/multer.js'
import * as  validationSchema  from './user.validation.js'

const router = Router()
const upload = myMulter('user');
// get profile
router.get('/profile', auth(), userController.getProfile)
// update profile
router.put('/updateProfile',auth(),upload.single('image'),HME,validation(validationSchema.updateProfileSchema),userController.updateProfile);
export default router