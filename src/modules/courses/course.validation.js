import joi from 'joi'
import { CourseLevel, CourseLocation } from '../../Utilities/enums.js';





export const createCourseSchema = {
  body: joi.object({
    name_en: joi.string().required(),
    name_ar: joi.string().required(),
    duration_en: joi.string().required(),
    duration_ar: joi.string().required(),
    overview_en: joi.string().required(),
    overview_ar: joi.string().required(),

    objectives_en: joi.array().items(joi.string()).min(1).required(),
    objectives_ar: joi.array().items(joi.string()).min(1).required(),

    outcomes_en: joi.array().items(joi.string()).min(1).required(),
    outcomes_ar: joi.array().items(joi.string()).min(1).required(),

    agenda_en: joi.object().unknown(true).required(),
    agenda_ar: joi.object().unknown(true).required(),

    examination_en: joi.object().unknown(true).required(),
    examination_ar: joi.object().unknown(true).required(),
    accreditation_en: joi.string().required(),

    features_en: joi.array().items(joi.string()).min(1).required(),
    features_ar: joi.array().items(joi.string()).min(1).required(),

    paymentMethods: joi.array().items(joi.string()).min(1).required(),

    category: joi.string().required(),
    level: joi.string().valid(...Object.values(CourseLevel)).required(),

    location: joi.array().items(joi.string().valid(...Object.values(CourseLocation))).min(1).required(),

    delegatesEnrolled: joi.number().integer().default(0),
    fees: joi.number().min(0).required(),

    type: joi.string().valid("FREE", "PAID").default("PAID"),
    discount: joi.number().min(0).max(100).optional().default(0),

    startDate: joi.date().required(),
    endDate: joi.date().greater(joi.ref("startDate")).required(),

    language: joi.array().items(joi.string().valid("English", "Arabic")).min(1).required(),

    instructorId: joi.number().integer().required(),

    // 🆕 New fields
   whoShouldAttend_en: joi.array().items(joi.string()).min(1).required(),
   whoShouldAttend_ar: joi.array().items(joi.string()).min(1).required(),
   prerequisites_en: joi.array().items(joi.string()).min(1).required(),
   prerequisites_ar: joi.array().items(joi.string()).min(1).required(),

   
    includes_en: joi.array().items(joi.string()).min(1).required(),
    includes_ar: joi.array().items(joi.string()).min(1).required(),

  })
};



// Get course by ID validation schema
export const getCourseByIdSchema = {
    params: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Course ID must be a number',
                'number.integer': 'Course ID must be an integer',
                'number.positive': 'Course ID must be a positive number',
                'any.required': 'Course ID is required'
            })
    })
}