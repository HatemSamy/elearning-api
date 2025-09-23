
// utils/translateCourse.js
export const translateCourse = (course, lang = "en") => ({
  id: course.id,
  name: lang === "ar" ? course.name_ar : course.name_en,
  duration: lang === "ar" ? course.duration_ar : course.duration_en,
  overview: lang === "ar" ? course.overview_ar : course.overview_en,
  objectives: lang === "ar" ? course.objectives_ar : course.objectives_en,
  outcomes: lang === "ar" ? course.outcomes_ar : course.outcomes_en,
  features: lang === "ar" ? course.features_ar : course.features_en,
  agenda: lang === "ar" ? course.agenda_ar : course.agenda_en,
  examination: lang === "ar" ? course.examination_ar : course.examination_en,
  accreditation: lang === "ar" ? course.accreditation_ar : course.accreditation_en,
  image: course.image,
  paymentMethods: course.paymentMethods,
  category: course.category,
  level: course.level,
  delegatesEnrolled: course.delegatesEnrolled,
  startDate: course.startDate,
  endDate: course.endDate,
  language: course.language,
  location: course.location,
  fees: course.fees,
  instructor: course.instructor,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt
});

