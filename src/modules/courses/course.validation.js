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
    outcomes_en: joi.string().required(),
    outcomes_ar: joi.string().required(),
    agenda_en: joi.object().unknown(true).required(),
    agenda_ar: joi.object().unknown(true).required(),
    examination_en: joi.string().required(),
    examination_ar: joi.string().required(),
    accreditation_en: joi.string().required(),
    features_en: joi.array().items(joi.string()).min(1).required(),
    features_ar: joi.array().items(joi.string()).min(1).required(),
    paymentMethods: joi.array().items(joi.string()).min(1).required(),
    category: joi.string().required(),
    level: joi.string().valid(...Object.values(CourseLevel)).required(),
    location: joi.array().items(joi.string().valid(...Object.values(CourseLocation))).min(1).required(),
    delegatesEnrolled: joi.number().integer().required(),
    fees: joi.string().required(),
    type: joi.string().valid("FREE", "PAID").default("PAID"),
    discount: joi.number().min(0).max(100).optional().default(0),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    language: joi.array().items(joi.string().valid("English", "Arabic")).min(1).required(),
    instructorId: joi.number().integer().required()
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