import joi from "joi";

export const wishlistSchema = {
  params: joi.object({
    courseId: joi.number().integer().positive().required().messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be a positive number",
      "any.required": "Course ID is required",
    }),
  }),
};
