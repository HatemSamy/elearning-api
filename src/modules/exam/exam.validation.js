import Joi from "joi";

// Question schema
const questionSchema = Joi.object({
  text: Joi.string().min(3).required(),
  options: Joi.array().items(Joi.string().required()).min(2).required(),
  correctAnswer: Joi.string().required(),
  mark: Joi.number().integer().min(1).required(),
});

// Exam schema
export const createExamSchema = {
  body: Joi.object({
    courseId: Joi.number().integer().required(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow('', null),
    duration: Joi.number().integer().min(1).required(), 
    totalMarks: Joi.number().integer().min(1).required(),
    questions: Joi.array().items(questionSchema).min(1).required(),
  }),
};


export const submitExamSchema = Joi.object({
  examId: Joi.number().integer().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().integer().required(),
        selectedOptionId: Joi.number().integer().required(),
      })
    )
    .required(),
});
