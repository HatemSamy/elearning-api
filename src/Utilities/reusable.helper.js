
// utils/translateCourse.js
// export const translateCourse = (course, lang = "en") => ({
//   id: course.id,
//   name: lang === "ar" ? course.name_ar : course.name_en,
//   duration: lang === "ar" ? course.duration_ar : course.duration_en,
//   overview: lang === "ar" ? course.overview_ar : course.overview_en,
//   objectives: lang === "ar" ? course.objectives_ar : course.objectives_en,
//   outcomes: lang === "ar" ? course.outcomes_ar : course.outcomes_en,
//   features: lang === "ar" ? course.features_ar : course.features_en,
//   agenda: lang === "ar" ? course.agenda_ar : course.agenda_en,
//   examination: lang === "ar" ? course.examination_ar : course.examination_en,
//   accreditation: lang === "ar" ? course.accreditation_ar : course.accreditation_en,
//   image: course.image,
//   paymentMethods: course.paymentMethods,
//   category: course.category,
//   level: course.level,
//   delegatesEnrolled: course.delegatesEnrolled,
//   startDate: course.startDate,
//   endDate: course.endDate,
//   language: course.language,
//   location: course.location,
//   fees: course.fees,
//   instructor: course.instructor,
//   createdAt: course.createdAt,
//   updatedAt: course.updatedAt
// });

// export const translateCourse = (course, lang = "en") => ({
//   id: course.id,
//   name: lang === "ar" ? course.name_ar : course.name_en,
//   duration: lang === "ar" ? course.duration_ar : course.duration_en,
//   overview: lang === "ar" ? course.overview_ar : course.overview_en,
//   objectives: lang === "ar" ? course.objectives_ar : course.objectives_en,
//   outcomes: lang === "ar" ? course.outcomes_ar : course.outcomes_en,
//   features: lang === "ar" ? course.features_ar : course.features_en,
//   agenda: lang === "ar" ? course.agenda_ar : course.agenda_en,
//   examination: lang === "ar" ? course.examination_ar : course.examination_en,
//   accreditation: lang === "ar" ? course.accreditation_ar : course.accreditation_en,
//   whoShouldAttend: lang === "ar" ? course.whoShouldAttend_ar : course.whoShouldAttend_en,
//   prerequisites: lang === "ar" ? course.prerequisites_ar : course.prerequisites_en,
  
//   image: course.image,
//   paymentMethods: course.paymentMethods,
//   category: course.category,
//   level: course.level,
//   delegatesEnrolled: course.delegatesEnrolled,
//   startDate: course.startDate,
//   endDate: course.endDate,
//   language: course.language,
//   location: course.location,
//   fees: course.fees,
//   discount: course.discount, 
//   instructor: course.instructor,
//   createdAt: course.createdAt,
//   updatedAt: course.updatedAt
// });


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
  whoShouldAttend: lang === "ar" ? course.whoShouldAttend_ar : course.whoShouldAttend_en,
  prerequisites: lang === "ar" ? course.prerequisites_ar : course.prerequisites_en,

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
  discount: course.discount, 

  instructor: course.instructor
    ? {
        id: course.instructor.id,
        username: course.instructor.user?.username || null,
        email: course.instructor.user?.email || null,
        bio: course.instructor.bio || null,
        specialization: course.instructor.specialization || null,
        social: course.instructor.social || null
      }
    : null,

  createdAt: course.createdAt,
  updatedAt: course.updatedAt
});







// helpers/formatInstructor.js
export const formatInstructor = (instructor) => {
  if (Array.isArray(instructor)) {
    return instructor.map(inst => formatInstructor(inst));
  }

  return {
    id: instructor.id,
    userId: instructor.user?.id,
    username: instructor.user?.username,
    email: instructor.user?.email,
    phone: instructor.user?.phone,
    role: instructor.user?.role,
    bio: instructor.bio,
    specialization: instructor.specialization,
    social: instructor.social,
    createdAt: instructor.createdAt,
    updatedAt: instructor.updatedAt
  };
};
