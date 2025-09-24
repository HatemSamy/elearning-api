export const autoParseJsonMiddleware = (req, res, next) => {
  const jsonFields = [
    "objectives_en", "objectives_ar",
    "agenda_en", "agenda_ar",
    "features_en", "features_ar",
    "paymentMethods", "location", "language",
    "whoShouldAttend_en", "whoShouldAttend_ar",
    "prerequisites_en", "prerequisites_ar",
    "outcomes_en", "outcomes_ar"   
  ];

  jsonFields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid JSON format for field: ${field}` 
        });
      }
    }
  });

  next();
};


