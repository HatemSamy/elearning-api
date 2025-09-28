

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




 //helpers/formatInstructor.js
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
    avatar: instructor.user?.avatar,
    specialization: instructor.specialization,
    social: instructor.social,
    certifications: instructor.certifications || [],
    languages: instructor.languages || [],
    yearsOfExperience: instructor.yearsOfExperience || 0,
    createdAt: instructor.createdAt,
    updatedAt: instructor.updatedAt
  };
};



const generateInvoiceNumber = (payment) => {
  const date = payment.createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${date}-${String(payment.id).padStart(4, "0")}`;
};


export const formatPurchase = (payment, lang = "en") => {
  return {
    id: payment.id,
    invoiceNumber: generateInvoiceNumber(payment), 
    amount: payment.amount,
    status: payment.status,
    createdAt: payment.createdAt,
    course: {
      id: payment.course.id,
      name: lang === "ar" ? payment.course.name_ar : payment.course.name_en,
      image: payment.course.image,
      level: payment.course.level,
    }
  };
};






export const formatCourse = (course, lang = "en") => {
  if (!course) return null;

  const courseDetails = translateCourse(course, lang);

  return {
    id: course.id,
    image: course.image,
    name: courseDetails.name,
    duration: courseDetails.duration,
    overview: courseDetails.overview,
    objectives: courseDetails.objectives,
    outcomes: courseDetails.outcomes,
    agenda: courseDetails.agenda,
    examination: courseDetails.examination,
    accreditation: course.accreditation_en, 
    features: courseDetails.features,
    paymentMethods: course.paymentMethods,
    category: course.category,
    level: course.level,
    location: course.location,
    delegatesEnrolled: course.delegatesEnrolled,
    fees: course.fees,
    discount: course.discount,
    startDate: course.startDate,
    endDate: course.endDate,
    language: course.language,
    whoShouldAttend: courseDetails.whoShouldAttend,
    prerequisites: courseDetails.prerequisites,
    includes: courseDetails.includes,
    instructor: course.instructor ? formatInstructor(course.instructor) : null,
  };
};
