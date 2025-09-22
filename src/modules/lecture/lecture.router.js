import express from "express";
import { HME, myMulter } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";
import * as lectureController from "./lecture.controller.js";
import * as validators from "./lecture.validation.js";
import { auth } from "../../middleware/auth.js";


const router = express.Router();

// POST /api/lectures
router.post(
"/:courseId",
  auth(),
  myMulter("lectures").single("video"), 
  HME,
  validation(validators.addLectureSchema),
  lectureController.addLecture
);

// GET /lectures/:lectureId
router.get("/:lectureId", auth(), lectureController.getLectureDetails);


export default router;
