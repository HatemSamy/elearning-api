// Course Location Enum
export const CourseLocation = {
  ELEARNING: "ELEARNING",
  ONSITE: "ONSITE", 
  ONLINE: "ONLINE",
  HYBRID: "HYBRID"
};

// Course Level Enum
export const CourseLevel = {
  FOUNDATION: "FOUNDATION",
  INTERNAL_AUDITOR: "INTERNAL_AUDITOR",
  LEAD_AUDITOR: "LEAD_AUDITOR",
  LEAD_IMPLEMENTER: "LEAD_IMPLEMENTER"
};

// Enrollment Mode Enum
export const EnrollmentMode = {
  ELEARNING: "ELEARNING",
  ONSITE: "ONSITE",
  ONLINE: "ONLINE", 
  HYBRID: "HYBRID"
};



// Array versions for validation
export const allowedLocations = Object.values(CourseLocation);
export const allowedLevels = Object.values(CourseLevel);
export const allowedEnrollmentModes = Object.values(EnrollmentMode);
