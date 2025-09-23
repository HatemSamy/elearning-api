import express from "express";
import * as lectureController from "./lecture.controller.js";
import * as validators from "./lecture.validation.js";
import { auth } from "../../middleware/auth.js";
import { videoMulter } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";


const router = express.Router();

// POST /api/lectures/:courseId
router.post(
  "/:courseId",
  auth(),
  (req, res, next) => {
    const courseId = req.params.courseId;
    videoMulter(courseId).single("video")(req, res, next);
  },
  validation(validators.addLectureSchema),
  lectureController.addLecture
);





// GET /lectures/:lectureId
router.get("/:lectureId", auth(), lectureController.getLectureDetails);


export default router;
