import joi from "joi";

export const addLectureSchema = {
  body: joi.object({
    title_en: joi.string().min(3).max(200).required(),
    title_ar: joi.string().min(3).max(200).required(),
    overview_en: joi.string().max(1000).optional(),
    overview_ar: joi.string().max(1000).optional(),
    duration: joi.number().integer().min(1).required(), 
  }),

  params: joi.object({
    courseId: joi.number().integer().required(),
  }),
};

