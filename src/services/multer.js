import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const HME = (err, req, res, next) => {
    if (err) {
        // Only handle multer-specific errors
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ 
                message: "File upload error", 
                error: err.message || err 
            });
        }
        return next(err);
    }
    next();
};

export function myMulter(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, `../../uploads/${folderName}`);
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, nanoid() + "_" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed types: ' + allowedMimeTypes.join(', ')), false);
        }
    };

    return multer({ 
        storage, 
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 
        }
    });
}



export function videoMulter(courseId) {
  if (!courseId) throw new Error("Course ID is required for Multer");

  const uploadPath = path.join(__dirname, `../../uploads/course_lectures/course_${courseId}/lectures`);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, nanoid() + "_" + file.originalname)
  });

  const fileFilter = (req, file, cb) => {
    const allowed = ["video/mp4","video/mkv","video/quicktime","video/webm","video/avi"];
    cb(null, allowed.includes(file.mimetype));
  };

  return multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });
}


